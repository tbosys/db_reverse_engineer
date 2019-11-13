var types = require("./types");

function gen(name, table, fields) {
  if (name == "knex_migrations" || name == "knex_migrations_lock") return;
  return `
'use strict'

exports.up = function (knex, Promise) {
  return knex.schema.createTable('${name}', function (table) {
    

    //auto fields
    ${fields
      .map(f => {
        // types[f.Type + "_" + f.Default + "_" + f.Extra] = f;
        return Map(f, name);
      })
      .filter(item => item != null)
      .join(" \n ")}

  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('${name}')
};


`;
}
module.exports = gen;

function Map(field, name) {
  if (field.Field == "namespaceId") return null;

  var fieldSize =
    field.Type.indexOf("(") > -1 && field.Type.indexOf(")") > -1
      ? field.Type.substring(field.Type.lastIndexOf("(") + 1, field.Type.lastIndexOf(")"))
      : null;

  var response;

  if (!types[name]) types[name] = [];
  if (field.Field.indexOf("Id") > -1 && field.Field.length > 2)
    types[name].push({ field: field.Field, table: name });

  if (field.Field == "id") response = "table.increments();";
  else if (field.Type.indexOf("varchar") > -1) {
    response = `table.string('${field.Field}' ${fieldSize ? `,${fieldSize}` : ""})`;
    if (field.Default) response += `.defaultTo('${field.Default}')`;
  } else if (field.Type.indexOf("decimal") > -1) {
    response = `table.decimal('${field.Field}' ${fieldSize ? `,${fieldSize}` : ""})`;
    if (field.Default) response += `.defaultTo(${field.Default})`;
  } else if (field.Type.indexOf("int") > -1) {
    if (field.Type) response = `table.integer('${field.Field}')`;
    if (field.Type.indexOf("unsigned") > -1 || field.Field == "ownerId") {
      response += ".unsigned()";
    } else if (fieldSize) response = `table.integer('${field.Field}', ${fieldSize})`;
    if (field.Default) response += `.defaultTo(${field.Default})`;
  } else if (field.Type.indexOf("timestamp") > -1) {
    response = `table.timestamp('${field.Field}').defaultTo(knex.fn.now())`;
  } else if (field.Type.indexOf("text") > -1 || field.Type.indexOf("longtext") > -1) {
    response = `table.text('${field.Field}')`;
  } else if (field.Type.indexOf("tinyint") > -1) {
    response = `table.boolean('${field.Field}')`;
  } else if (field.Type.indexOf("date") > -1 || field.Type.indexOf("datetime") > -1) {
    response = `table.datetime('${field.Field}')`;
  } else console.log(field);

  //if (response && field.Null == "NO") response += ".notNullable()";

  return response;
}
