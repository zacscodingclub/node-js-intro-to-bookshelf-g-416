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

let mockPost = {
  title: 'Test Post',
  body: 'This is just a test post with no content.'
};

describe('Server', () => {

  it('POST to /user with user data returns new user id', (done) => {
    request(baseUrl)
      .post('/user')
      .send(mockUser)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have key', 'id');
        expect(resp.body.id, 'to be a', 'number');
        done();
      });
  });

  it('POST to /post with post data returns new post id', (done) => {
    blog.User.forge({username: 'sally'}).fetch().then((usr) => {
      mockPost.user_id = usr.id;
      request(baseUrl)
        .post('/post')
        .send(mockPost)
        .expect(200)
        .end((err, resp) => {
          if (err) done(err);
          expect(resp.body, 'to have key', 'id');
          expect(resp.body.id, 'to be a', 'number');
          done();
        });
    });

  });

});
