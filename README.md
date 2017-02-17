# mongoose-async-class

Cleaner ES6 async class wrapper for Mongoose in Node 4.0.0+. A solution to using promises
and coroutines with classes without the overhead of babel, or the need to adopt
unimplemented syntax and features, until v8/node supports ES7 async/await.

This package use a a Forked async-class (https://travis-ci.org/danielstjules/async-class) that is implemented with Generators and Co (https://github.com/tj/co).


[![Build Status](https://github.com/viniciusps2/mongoose-async-class.svg?branch=master)](https://travis-ci.org/viniciusps2/mongoose-async-class)

## Installation

```
npm install --save mongoose-async-class
```

## Overview

Using it is simple:

``` javascript
// collection.js

const wrapSchema = require('mongoose-async-class')
const mongoose = require('mongoose')
const {Schema} = mongoose

class User extends Schema {
  constructor () {
    super({
      firstName: String,
      lastName: String
    })
  }
  static * findOneByName (name) {
    const user = yield this.findOne({name: new RegExp(name, 'g')})
    return user
  }
  getFullName () {
    // simple functions not async
    return this.firstName + ' ' + this.lastName
  }
  * getComments () {
    // do something async using yield ...
    return []
  }
}

module.exports = mongoose.model('users', wrapSchema(User))
```


``` javascript
// controller.js
// . . .

const user = yield User.findOneByName('test')
console.log('FullName:', user.getFullName())

```


Clean ES6 classes and async methods for Mongoose!

## API

#### async-class.wrapSchema(klass)

Wraps static and instance methods whose name ends with Async, or are
GeneratorFunctions, other methods will not be wrapped but can be used when calling a Model.
Any GeneratorFunction is wrapped with co.wrap(). Returns the class.
