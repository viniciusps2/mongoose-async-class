const {getStaticMethods, getInstanceMethods} = require('async-class-co')

function wrapSchema (SchemaClass) {
  const schema = new SchemaClass()
  schema.statics = getStaticMethods(SchemaClass)
  schema.methods = getInstanceMethods(SchemaClass)
  return schema
}

module.exports = wrapSchema
