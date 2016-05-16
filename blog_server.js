"use strict";

const _            = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');

const app = express();
app.use(bodyParser.json());

const dbName = process.env.NODE_ENV ? 'learnco_blog_test' : 'learnco_blog';
console.log('Using database: ', dbName);

// ***** Knex & Bookshelf Configuration ***** //

const knex = require('knex')({
  client: 'pg',
  connection: {
    database: dbName
  },
  debug: true
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
      tbl.increments('id').primary();
      tbl.string('name');
      tbl.string('username');
      tbl.string('email');
      tbl.timestamps();
    }),
    knex.schema.createTableIfNotExists('posts', (tbl) => {
      tbl.increments();
      tbl.string('title');
      tbl.string('body');
      tbl.integer('user_id').references('users.id');
      tbl.timestamps();
    })
  ]);
};

const destroySchema = () => {
  return knex.schema.dropTable('posts').dropTable('users');
};

// ***** Models ***** //

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  posts: () => {
    return this.hasMany(Posts);
  },
});

const Posts = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,
  author: () => {
    return this.belongsTo(User);
  },
});

// ***** Server ***** //

app.post('/user', (req, res) => {
  if (_.isEmpty(req.body))
    return;
  User
    .forge(req.body)
    .save()
    .then((usr) => {
      res.send({id: usr.id});
    })
    .catch((error) => {
      console.error(error);
    });
});
    })
    .catch((error) => {
      console.error(error);
    });
});

// ***** Module Exports ***** //

const listen = (port) => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      resolve();
    });
  });
};

const up = (justBackend) => {
  justBackend = _.isUndefined(justBackend) ? false : justBackend;
  return setupSchema().then(() => {
    console.log('Done building schema...');
  }).then(() => {
    if(justBackend)
      return;
    return listen(3000);
  }).then(() => {
    console.log('Listening on port 3000...');
  }).catch((error) => {
    console.error(error);
  });
};

const tearDown = () => {
  if(!process.env.TESTING)
    return;
  return destroySchema().then(() => {
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
