'use strict';

const { app, runServer, closeServer } = require('../server');
const chai = require('chai');
const chai_http = require('chai-http');

const should = chai.should();

chai.use(chai_http);

const PORT = process.env.PORT;

describe('GET / Home ', () => {

    before(() => {
        return runServer(PORT);
    });

    after(() => {
        return closeServer();
    });

    it('should return a status of 200 on home endpoint', () => {
        return chai.request(app)
            .get('/')
            .then((response) => {
                response.should.have.status(200);
            });
    });

});
