"use strict";

const _      = require('lodash');
const expect = require('unexpected');

const blog = require('../blog_server');

let mockUser = {
  name: 'Sally Low',
  username: 'sally',
  email: 'sally@example.org'
};

describe('Models', () => {

  it('necessary models exist', (done) => {
    expect(blog.User, 'to be defined');
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

});
