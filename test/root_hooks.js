"use strict";

const blog = require('../blog_server');

before((done) => {
  blog.up().then(done);
});

