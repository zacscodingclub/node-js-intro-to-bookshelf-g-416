"use strict";

const expect  = require('unexpected');
const request = require('supertest');
const baseUrl = 'http://localhost:3000';

// Set mode to testing.
process.env.TESTING = true;

const blog = require('../blog_server');

let mockUser = {
  name: 'Sally Low',
  username: 'sally',
  email: 'sally@example.org'
};

describe('Server', () => {

  it('POST to /user with user data returns new user', (done) => {
    request(baseUrl)
      .post('/user')
      .send(mockUser)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have keys', [
          'id',
          'username',
          'email',
          'name',
        ]);
        expect(resp.body.name, 'to be', 'Sally Low');
        expect(resp.body.username, 'to be', 'sally');
        expect(resp.body.email, 'to be', 'sally@example.org');
        done();
      });
  });

});
