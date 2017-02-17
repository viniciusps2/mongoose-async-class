const expect = require('chai').expect
const wrapSchema = require('./index')
const mongoose = require('mongoose')
const {Schema} = mongoose
require('co-mocha')

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
  static findAll (name) {
    return this.find()
  }
  getFullName () {
    return this.firstName + ' ' + this.lastName
  }
  * getComments () {
    return ['comment 1']
  }
}

const wrapedSchema = wrapSchema(User)
const Model = mongoose.model('users', wrapedSchema)

describe('test mongoose async class', () => {
  beforeEach(function * () {
    this.instance = new Model({firstName: 'John', lastName: 'Smith'})
  })

  it('should define static methods wrapped', function * () {
    expect(wrapedSchema.statics.findOneByName.name).to.be.eq('createPromise')
    expect(Model.findOneByName.name).to.be.eq('createPromise')
  })

  it('should define static methods not wrapped', function * () {
    expect(typeof wrapedSchema.statics.findAll).to.be.eq('function')
    expect(wrapedSchema.statics.findAll.name).to.be.eq('findAll')
    expect(Model.findAll.name).to.be.eq('findAll')
  })

  it('should define instance methods wrapped', function * () {
    expect(wrapedSchema.methods.getComments.name).to.be.eq('createPromise')
    expect(this.instance.getComments.name).to.be.eq('createPromise')
    expect(yield this.instance.getComments()).to.be.eql(['comment 1'])
  })

  it('should define instance methods not wrapped', function * () {
    expect(wrapedSchema.methods.getFullName.name).to.be.eq('getFullName')
    expect(typeof wrapedSchema.methods.getFullName).to.be.eq('function')
    expect(this.instance.getFullName()).to.be.eq('John Smith')
  })

  it('should access other mongoose methods', function * () {
    expect(Model.find.name).to.be.eq('find')
    expect(typeof Model.find).to.be.eq('function')
  })
})
