"use strict";

const blog = require('../blog_server');

process.env.TESTING = true;

before((done) => {
  blog.up().then(done);
});

after(() => {
  blog.tearDown();
})
