"use strict";

var expect = require('chai').expect,
    request = require('request'),
    server = require('../index'),
    redis = require('redis'),
    client;
client = redis.createClient();

describe('server', function () {
    before(function (done) {
        console.log('Starting the server');
        done();
    });
    after(function (done) {
        console.log('Stopping the server');
        client.flushdb();
        done();
    });

    describe('Test the index route', function () {
        it('should return a page with the title Shortbread', function (done) {
            request.get({ url: 'http://localhost:5000' }, function (error, response, body) {
                expect(body).to.include('Shortbread');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });
});