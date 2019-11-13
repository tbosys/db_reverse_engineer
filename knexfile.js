var moment = require("moment-timezone");

module.exports = {
  development: {
    debug: false,
    client: "mysql2",

    connection: {
      user: "root",
      host: "127.0.0.1",
      database: "development1",
      password: "monomono",
      timezone: "UTC",
      typeCast: function(field, next) {
        if (field.type == "DATETIME" || field.type == "TIMESTAMP") {
          return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
        }
        if (field.type == "NEWDECIMAL" || field.type == "LONG") {
          var value = field.string();
          if (!value || value == "") return null;
          return parseFloat(value);
        }
        if (field.type == "DATE") {
          var value = field.string();
          if (!value || value == "") return null;
          return moment(value).format("YYYY-MM-DD");
        }
        if (next) return next();
        else return field.toString();
      }
    }
  },

  staging: {
    debug: false,
    client: "mysql2",

    connection: {
      host: "db.staging.efactura.io",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: process.env.ACCOUNT,
      charset: "utf8mb4",
      timezone: "UTC",
      typeCast: function(field, next) {
        if (field.type == "DATETIME" || field.type == "TIMESTAMP") {
          return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
        }
        if (field.type == "NEWDECIMAL" || field.type == "LONG") {
          var value = field.string();
          if (!value || value == "") return null;
          return parseFloat(value);
        }
        if (field.type == "DATE") {
          var value = field.string();
          if (!value || value == "") return null;
          return moment(value).format("YYYY-MM-DD");
        }
        return next();
      }
    }
  },

  production: {
    debug: false,
    client: "mysql2",
    connection: {
      host: "db.production.efactura.io",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: process.env.ACCOUNT,
      charset: "utf8mb4",
      timezone: "UTC",
      typeCast: function(field, next) {
        if (field.type == "DATETIME" || field.type == "TIMESTAMP") {
          return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
        }
        if (field.type == "NEWDECIMAL" || field.type == "LONG") {
          var value = field.string();
          if (!value || value == "") return null;
          return parseFloat(value);
        }
        if (field.type == "DATE") {
          var value = field.string();
          if (!value || value == "") return null;
          return moment(value).format("YYYY-MM-DD");
        }
        if (next) return next();
        else return field.toString();
      }
    }
  }
};
