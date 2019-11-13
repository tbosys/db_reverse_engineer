var types = require("./types");

function relate() {
  var ups = [];
  var downs = [];

  Object.keys(types).map(name => {
    const fields = types[name];
    fields.map(fieldItem => {
      if (!types[fieldItem.field.replace("Id", "")]) return;
      ups.push(`alterTable('${name}', function (table) {
        
        table.foreign('${fieldItem.field}').references('id').inTable('${fieldItem.field
        .replace("Id", "")
        .toLowerCase()}').onDelete("RESTRICT")    
        })`);
      downs.push(`alterTable('${name}', function (table) {
            table.dropForeign('${fieldItem.field}');
            table.dropColumn('${fieldItem.field}');
        })`);
    });
  });

  return `
'use strict'

exports.up = function (knex, Promise) {
    //auto fields
    return knex.schema.${ups.join(".")};
  
};

exports.down = function (knex, Promise) {
    return knex.schema.${downs.join(".")};
}
`;
}
module.exports = relate;
