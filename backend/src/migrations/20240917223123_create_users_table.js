exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary(); 
    table.string('userName').notNullable().unique();
    table.string('password').notNullable(); 
    table.string('name').notNullable();
    table.date('dateOfBirth').notNullable(); 
    table.string('weight').notNullable();
    table.string('height').notNullable();
    table.string('gender').notNullable();
    table.string('objective').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};