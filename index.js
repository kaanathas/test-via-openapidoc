const express = require('express')
const app = express()
const port = 3000
const faker=require('faker');
const jsYaml = require('js-yaml')
const fs = require('fs')
const appRoot = require('app-root-path')
const { OpenApiValidator } = require('express-openapi-validate')

// Load the OpenAPI document
const openApiDocument 
    = jsYaml.safeLoad(fs.readFileSync(`${appRoot}/src/spec/api.yaml`, "utf-8"));

// Create the validator from the spec document
const validator = new OpenApiValidator(openApiDocument, {});

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('X-Request-Id',faker.random.uuid())
    
    res.json({version: '1.0.0'})})

app.get('/try', (req, res) => {
        res.setHeader('X-Request-Id',faker.random.uuid())
        res.json({version: '1.0.0'})})

app.post('/records',
        validator.validate("post", '/records'),
        (req, res, next) => {
        
        res.send(`Should handle the search for : ${JSON.stringify(req.body)}`)
    })

app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
          error: {
            name: err.name,
            message: err.message,
            data: err.data,
          },
        });
      });

app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app