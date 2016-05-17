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

let mockComment = {
  body: 'This is just a test comment.'
};

describe('Server', () => {

  it('POST to /user with valid data returns new user id', (done) => {
    request(baseUrl)
      .post('/user')
      .send(mockUser)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have key', 'id');
        expect(resp.body.id, 'to be a', 'number');
        mockUser.id = resp.body.id;
        done();
      });
  });

  it('GET to /user/:id with id specified returns usr object', (done) => {
    request(baseUrl)
      .get('/user/' + mockUser.id)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have keys', [
          'id',
          'name',
          'username',
          'email',
          'created_at',
          'updated_at',
        ]);
        expect(resp.body.id, 'to be a', 'number');
        expect(resp.body.id, 'to be', mockUser.id);
        expect(resp.body.name, 'to be', mockUser.name);
        expect(resp.body.username, 'to be', mockUser.username);
        expect(resp.body.email, 'to be', mockUser.email);
        done();
      });
  });

  it('POST to /post with post data returns new post id', (done) => {
    mockPost.author = mockUser.id;
    request(baseUrl)
      .post('/post')
      .send(mockPost)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have key', 'id');
        expect(resp.body.id, 'to be a', 'number');
        mockPost.id = resp.body.id;
        done();
      });
  });

  it('GET to /post/:id with id specified returns post object', (done) => {
    request(baseUrl)
      .get('/post/' + mockPost.id)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have keys', [
          'id',
          'title',
          'body',
          'created_at',
          'updated_at',
        ]);
        expect(resp.body.id, 'to be a', 'number');
        expect(resp.body.id, 'to be', mockPost.id);
        expect(resp.body.title, 'to be', mockPost.title);
        expect(resp.body.body, 'to be', mockPost.body);
        expect(resp.body.author, 'to be a', 'object');
        expect(resp.body.author.id, 'to be', mockUser.id);
        expect(resp.body.author.name, 'to be', mockUser.name);
        done();
      });
  });

  it('POST to /comment with valid data returns new comment id', (done) => {
    mockComment.user_id = mockUser.id;
    mockComment.post_id = mockPost.id;
    request(baseUrl)
      .post('/comment')
      .send(mockComment)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have key', 'id');
        expect(resp.body.id, 'to be a', 'number');
        done();
      });
  });

  it('POST to /comment with empty data returns 400', (done) => {
    request(baseUrl)
      .post('/comment')
      .send({})
      .expect(400, done);
  });

  it('GET to /post/:id where post has comment includes comments in response',
    (done) => {
      request(baseUrl)
      .get('/post/' + mockPost.id)
      .expect(200)
      .end((err, resp) => {
        if (err) done(err);
        expect(resp.body, 'to have key', 'comments');
        expect(resp.body.comments, 'to be a', 'array');
        expect(resp.body.comments, 'to have length', 1);
        done();
    });
  });

});
