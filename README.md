# mongoose-async-class

Clean ES6 async class wrapper for Mongoose in Node 4.0.0+. A solution to use promises and coroutines with classes without the overhead of babel, or the necessity to adopt unimplemented syntax and features like async/await (until v8/node supports those features).

This package uses [async-class-co](https://github.com/viniciusps2/async-class-co) which is a fork from the project [async-class](https://github.com/danielstjules/async-class). But implemented with Generators and [Co](https://github.com/tj/co) instead of Bluebird (present in the original async-class project).


[![Build Status](https://travis-ci.org/viniciusps2/mongoose-async-class.svg?branch=master)](https://travis-ci.org/viniciusps2/mongoose-async-class)

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
GeneratorFunctions, other methods will not be wrapped but can be used when calling the Model.
Any GeneratorFunction is wrapped with co.wrap(). Returns the class.
