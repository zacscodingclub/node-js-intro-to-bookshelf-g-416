"use strict";

process.env.TESTING = true;

const blog = require('../blog_server');

before((done) => {
  blog.up().then(done);
});

after((done) => {
  blog.tearDown().then(done);
});
