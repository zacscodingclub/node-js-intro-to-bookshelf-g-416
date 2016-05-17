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
      tbl.increments().primary();
      tbl.string('title');
      tbl.string('body');
      tbl.integer('author').references('users.id');
      tbl.timestamps();
    }),
    knex.schema.createTableIfNotExists('comments', (tbl) => {
      tbl.increments().primary();
      tbl.string('body');
      tbl.integer('author').references('users.id');
      tbl.integer('post').references('posts.id');
      tbl.timestamps();
    })
  ]);
};

const destroySchema = () => {
  return knex.schema
    .dropTable('comments')
    .dropTable('posts')
    .dropTable('users');
};

// ***** Models ***** //

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  posts: function() {
    return this.hasMany(Posts, 'author');
  },
  comments: function() {
    return this.hasMany(Comments, 'commenter');
  },
});

const Posts = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,
  author: function() {
    return this.belongsTo(User, 'author');
  },
  comments: function() {
    return this.hasMany(Comments);
  },
});

const Comments = bookshelf.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  commenter: function() {
    return this.belongsTo(User, 'commenter');
  },
  post: function() {
    return this.belongsTo(Posts);
  },
});

// ***** Server ***** //

app.get('/user/:id', (req,res) => {
  if (_.isUndefined(req.params.id))
    return;
  User
    .forge({id: req.params.id})
    .fetch()
    .then((usr) => {
      res.send(usr);
    })
    .catch((error) => {
      console.error(error);
    });
});

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

app.get('/post/:id', (req,res) => {
  if(_.isUndefined(req.params.id))
    return;
  Posts
    .forge({id: req.params.id})
    .fetch({withRelated: 'author'})
    .then((post) => {
      res.send(post);
    });
});

app.post('/post', (req, res) => {
  if(_.isEmpty(req.body))
    return;
  Posts
    .forge(req.body)
    .save()
    .then((post) => {
      res.send({id: post.id});
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
  'Comments': Comments,
  'up': up,
  'tearDown': tearDown
};
