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
};

let mockComment = {
  body: 'This is a test comment.',
};

describe('Models', () => {

  it('User models exist', () => {
    expect(blog.User, 'to be defined');
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
        mockUser.id = usr.get('id');
        done();
      });
  });

  it('Posts model exists', () => {
    expect(blog.Posts, 'to be defined');
  });

  it('Posts model can save a post', (done) => {
    mockPost.author = mockUser.id;
    blog.Posts
      .forge(mockPost)
      .save()
      .catch((err) => { done(err); })
      .then((post) => {
        expect(post.attributes, 'to have keys', [
          'title',
          'body',
          'id',
          'author',
        ]);
        mockPost.id = post.get('id');
        done();
      });
  });

  it('Comments model exists', () => {
    expect(blog.Comments, 'to be defined');
  });

  it('Comments model can save a comment on a post', (done) => {
    mockComment.post_id = mockPost.id;
    mockComment.user_id = mockUser.id;
    blog.Comments
      .forge(mockComment)
      .save()
      .catch((err) => { done(err); })
      .then((comment) => {
        expect(comment.attributes, 'to have keys', [
          'id',
          'user_id',
          'body',
          'created_at',
          'updated_at',
        ]);
        done();
      });
  });

});
