"use strict";

const dbName = process.env.TESTING ? 'learnco_blog_test' : 'learnco_blog';

console.log('dbName:', dbName);

// ***** Knex & Bookshelf Configuration ***** //

const knex = require('knex')({
  client: 'pg',
  connection: {
    database: dbName
  },
  // debug: true
});

const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});

  const bookshelf = require('bookshelf')(knex);

// ***** Schema Setup ***** //

const setupSchema = () => {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', (tbl) => {
      tbl.increments();
      tbl.string('name');
      tbl.string('username');
      tbl.string('email');
      tbl.timestamps();
    }),
    knex.schema.createTableIfNotExists('posts', (tbl) => {
      tbl.increments();
      tbl.string('title');
      tbl.string('body');
      tbl.timestamps();
    })
  ]);
};

const destroySchema = () => {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('posts')
  ]);
};

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimeStamps: true,
});

const Posts = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimeStamps: true,
});

const up = () => {
  setupSchema().then(() => {
    console.log('Done building schema...');
  }).catch((error) => {
    console.error(error);
  });
};

const tearDown = () => {
  if(!process.env.TESTING)
    return;
  destroySchema().then(() => {
    console.log('Schema destroyed.');
  }).catch((error) => {
    console.error(error);
  });
};

module.exports = {
  'User': User,
  'Posts': Posts,
  'up': up,
  'tearDown': tearDown
};
