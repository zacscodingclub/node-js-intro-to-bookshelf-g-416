"use strict";

const _      = require('lodash');
const expect = require('unexpected');

const blog = require('../blog_server');

let mockUser = {
  name: 'Sally Low',
  username: 'sally',
  email: 'sally@example.org'
};

let mockPost = {
  title: 'My Test Post',
  body: 'This is just a test post with no real content.',
  user_id: 1
};

describe('Models', () => {

  it('necessary models exist', (done) => {
    expect(blog.User, 'to be defined');
    expect(blog.Posts, 'to be defined');
    done();
  });

  it('User model can save a user', (done) => {
    blog.User
      .forge(mockUser)
      .save()
      .then((usr) => {
        expect(usr.attributes, 'to have keys', [
          'name',
          'email',
          'username',
        ]);
        expect(usr.get('name'), 'to be', mockUser.name);
        expect(usr.get('email'), 'to be', mockUser.email);
        expect(usr.get('username'), 'to be', mockUser.username);
        done();
      });
  });

  it('Posts model can save a post', (done) => {
    blog.Posts
      .forge(mockPost)
      .save()
      .catch((err) => { done(err); })
      .then((post) => {
        expect(post.attributes, 'to have keys', [
          'id',
          'title',
          'body',
          'user_id',
          'created_at',
        ]);
        done();
      });
  });

});
