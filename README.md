Building a Blog with Bookshelf.Js
=================================

## Overview

In this lab, we will build the backend for a blog using the ORM libraries [Knex](http://knexjs.org/) (which we've used once already) and [Bookshelf.js](http://bookshelfjs.org/).

## Introduction

![Blogging Graphic](http://ezmiller.s3.amazonaws.com/public/flatiron-imgs/blog.gif)

Ever heard of a blog? Of course you have! We all use blogs every day; they're one of the most common symbols of the disruptive power of web technology. But do you know how to build one? That's what we'll be doing in this lab. We'll build a blog back end that can handle users, posts, and commenting on posts. As we move through this unit, we will expand and build on the work we do here.

## What We'll Use to Build: Knex & Bookshelf.js

Before we get into building our blog, let's talk first about the tools that we'll be using. In this lab, we'll be building things out with one tool that you are already familiar with -- knex -- and a new one called Bookshelf.js, which builds on top of knex. Now as you'll remember, knex is a tool for interacting with and querying databases. It allows us to do things like:

```
knex('users').select('*').where({id: 1});
```

That way we don't have to write out the query ourselves or worry about the particular syntax that a specific database may require. Bookshelf.js builds on top of knex, allowing us to reach an even higher level of abstraction when dealing with the units of data that comprise our application.

What does this mean more concretely? It means that we can define a model like so:

```
const User = bookshelf.Model.extend({
  tableName: 'users'
});
```

And, once we've done that, later on when we want to query our database about a user, we can just do the following:

```
User.forge({id: 1}).fetch().then((usr) => {
  console.log(usr);
})
```

In other words, Bookshelf provides us with a more expressive syntax for interacting with the data in our application. In addition, as we'll discover in this lab, it makes it MUCH easier to define and work with the relationships *between* our data in the database.

## Bookshelf & Knex v. ActiveRecord

Now many of you are very familiar with the ActiveRecord tool for defining data that is used in Rails. As such, you're probably already seeing some similarities between Bookshelf / Knex and ActiveRecord. If so, you're right!

How would we do the above in ActiveRecord? Well, something like this:

```
class User < ActiveRecord::Base
end

user = User.find(1)
```

Another similarity is that through its depednency on Knex, Bookshelf, like ActiveRecord, includes the concept of a database migrations for handling database changes and versioning.

So just as we might do something like this in ActiveRecord to support the User table model:

```
$ bin/rails generate model User id:integer name:string
```

thereby generating the following migration:

```
class CreateUser < ActiveRecord:Migrations[5.0]
   def change
    create table :users do |t|
      t.integer :id
      t.string :name
    end
   end
end
```

tnd then running our migrations with `rails db:migrate`. Using Bookshelf & Knex we'd do something quite similar. First we would run the following:

```
$ knex migrate:make User
```

This would create a migration file in the migrations directory that looks like this:

```
exports.up = function(knex, Promise) {

};

exports.down = function(knex, Promise) {

};
```

At this point, we would fill in the appropriate knex function calls to create our table using the [knex schema functions](http://knexjs.org/#Schema). Something like this:

```
exports.up = function(knex, Promise) {
  knex.schema.createTable('users').then((tbl) => {
    tbl.increments();
    tbl.string('name');
  }
};

exports.down = function(knex, Promise) {
  knex.schema.destroyTable('users');
};
```

And finally, we'd run our migrations: `knex migrate:latest`. The `up` and `down` functions here specify, respectively, the change to the database, and the way to rollback that change.

## So How Can We Compare Bookshelf & ActiveRecord?

Well, as you can see Bookshelf and ActiveRecord seek to achieve the same high level of abstraction, allowing us to think about and manipulate our data in the database without having to worry about the detailed query language that our database may be using.

Additionally, both Bookshelf and ActiveRecord are implementations of a software pattern called "Object Relational Mapping" or ORM. You can read more about ORM [here](http://en.wikipedia.org/wiki/Object-relational_mapping) and [here](https://stackoverflow.com/questions/1279613/what-is-an-orm-and-where-can-i-learn-more-about-it).

But what are the differences between Bookshelf.Js and ActiveRecord? Well, essentially the the biggest difference is that Bookshelf.Js is going to require you to write out much more of the query logic yourself using the knex schema builder functions and syntax.

Which is better? Well, ActiveRecord handles so much behind the scenes for you so beautifully that it's hard not to admire the slickness of the machinery! Perhaps, though, it's satisfying to be involved at a slighly lower level with the code that is manipulating your data in the database as you are when using Bookshelf / Knex.

But for the moment let's not judge. Let's just notice how different it feels to represent your application data in Bookshelf compared to Active Record.

## Okay Let's Build!

Alright, now that we are through discussing the theoretical concerns, let's get to work. The first step, as always, is to install the necessary modules as specified in the package.json tests. Go ahead and do that now. Notice that for the knex library we are going to be using a specific version (v0.10.0).

Once you've installed all the necessary packages, open up the `blog_server.js` file. This where we'll build the blog. We've put some code in here already that handles the configuration of Bookshelf & Knex as well as the methods for running the server and migrations. Let's go through this quickly so it's clear what's going on before we begin.

At the top of the file, as usual, you'll see a series of require statements that pull in our necessary modules. Some of these, like express and body-parser, you should recognize. Notice also that we are importing the knex config file `knexfile.js` into the variable config. Then, a few lines down, we use this object to configure knex and bookshelf.

The other thing we might want to inspect here is the exported function `up` that is used to start up our server. Notice here the chain of promises that are being called. In particular, note the first promise function: `knex.migrate.latest`. This function, documented [here](http://knexjs.org/#Migrations-latest) is essentially the same as running `knex migrate:latest` on the command line. What this means is that every time we start the server, our latest batch of migrations is run. So you don't need to run your migrations manually unless you want to.

That's about it then. As you are building, you can start your server using `npm start` and to run the tests do `npm test`.

Now without further ado here is our specification. We want to build a blog server with the following characteristics:

1. The blog should consist of users, who can create posts as well as comment on posts.
2. Each user should be able to write many posts, and many comments on a post. Plus each post should be able to have many comments.
3. We should be able to fetch information about a user and a single post.
4. When we fetch a post, the data returned should include the user's data as well as a list of the comments associated with the post.
5. We should also be able to fetch a list of all the posts.

As usual, this specification is also reflected in the tests in the tests directory, so consult the tests as well for guidance on how to begin building.

Enjoy!

## Resources

* Bookshelf documentation: [bookshelfjs.org](http://bookshelfjs.org)
* Knex documentation: [knexjs.org](http://knexjs.org)
* [Wikipedia entry for "Object Relational Mapping" (ORM)](https://en.wikipedia.org/wiki/Object-relational_mapping)
