'use strict'

const asyncClassCo = require('async-class-co')

function wrapSchema (SchemaClass) {
  const schema = new SchemaClass()
  schema.statics = asyncClassCo.getStaticMethods(SchemaClass)
  schema.methods = asyncClassCo.getInstanceMethods(SchemaClass)
  return schema
}

module.exports = wrapSchema
