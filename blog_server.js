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

// ***** Models ***** //

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  posts: function() {
    return this.hasMany(Posts, 'author');
  },
  comments: function() {
    return this.hasMany(Comments);
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
  user: function() {
    return this.belongsTo(User);
  },
  post: function() {
    return this.belongsTo(Posts);
  },
});

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
      tbl.integer('user_id').references('users.id');
      tbl.integer('post_id').references('posts.id');
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

// ***** Server ***** //

app.get('/user/:id', (req,res) => {
  User
    .forge({id: req.params.id})
    .fetch()
    .then((usr) => {
      if (_.isEmpty(usr))
        return res.sendStatus(404);
      res.send(usr);
    })
    .catch((error) => {
      console.error(error);
      return res.sendStatus(500);
    });
});

app.post('/user', (req, res) => {
  if (_.isEmpty(req.body))
    return res.sendStatus(400);
  User
    .forge(req.body)
    .save()
    .then((usr) => {
      res.send({id: usr.id});
    })
    .catch((error) => {
      console.error(error);
      return res.sendStatus(500);
    });
});

app.get('/posts', (req, res) => {
  Posts
    .collection()
    .fetch()
    .then((posts) => {
      res.send(posts);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

app.get('/post/:id', (req,res) => {
  Posts
    .forge({id: req.params.id})
    .fetch({withRelated: ['author', 'comments']})
    .then((post) => {
      if (_.isEmpty(post))
        return res.sendStatus(404);
      res.send(post);
    })
    .catch((error) => {
      console.error(error);
      return res.sendStatus(500);
    });
});

app.post('/post', (req, res) => {
  if(_.isEmpty(req.body))
    return res.sendStatus(400);
  Posts
    .forge(req.body)
    .save()
    .then((post) => {
      res.send({id: post.id});
    })
    .catch((error) => {
      console.error(error);
      return res.sendStatus(500);
    });
});

app.post('/comment', (req, res) => {
  if (_.isEmpty(req.body))
    return res.sendStatus(400);
  Comments
    .forge(req.body)
    .save()
    .then((comment) => {
      res.send({id: comment.id});
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
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
