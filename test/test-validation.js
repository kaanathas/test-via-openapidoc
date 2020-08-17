const request = require('supertest')
const { expect } = require('chai')

const jsYaml = require('js-yaml')
const fs = require('fs')
const appRoot = require('app-root-path')
const { OpenApiValidator } = require('express-openapi-validate')

// Load the OpenAPI document
const openApiDocument 
    = jsYaml.safeLoad(fs.readFileSync(`${appRoot}/src/spec/api.yaml`, "utf-8"));

// Create the validator from the spec document
const validator = new OpenApiValidator(openApiDocument, {});

const app = require('../index')

describe('index', function () {
  

    it('should return a valid response', function () {


        const validateResponse= validator.validateResponse('get', '/')
        return request(app)
            .get('/')
            .expect(200)
            .then((res) => {
              
                expect(validateResponse(res)).to.be.undefined //validate
            })
            .catch((err) => {
                console.log(err)
                expect(err).to.be.undefined}
                
                )
                
    })

    it('should return a valid response in/try', function () {
        const validateResponse= validator.validateResponse('get', '/try')
        return request(app)
            .get('/try')
            .expect(200)
            .then((res) => {
                // console.log(validateResponse())
                expect(validateResponse(res)).to.be.undefined //validate
            })
            .catch((err) => expect(err).to.be.undefined)
    })


    it('check the post request via open api spec', function(done) {
        request(app)
          .post('/records')
          .send({
             "criteria":"foo",
             "start":1,
             "rows":1000,
             "foo":"bar"
          }) 
          .set('Accept', 'application/json')
          .expect(400)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })



})