var test = require('tape'),
    Builder = require('./index.js').Builder,
    builder = new Builder();

test('can #create', function(t){

  t.plan(2);

  var c1 = builder.buildCreateRecord(),
      c2 = builder.buildCreateRecord();

  t.notEqual(c1.entity_id,
             c2.entity_id);

  t.ok(c1.timestamp < c2.timestamp);

});

test('can #update', function(t){

  t.plan(8);

  var key = "name",
      c1 = builder.buildCreateRecord(),
      u1 = builder.buildUpdateRecord(c1.entity_id, key, valA = "things"),
      u2 = builder.buildUpdateRecord(c1.entity_id, key, valB = "stuff");

  t.equal(u1.entity_id, c1.entity_id);
  t.equal(u2.entity_id, c1.entity_id);

  t.equal(u1.value, valA);
  t.equal(u2.value, valB);

  t.equal(u1.key, key);
  t.equal(u2.key, key);

  t.ok(c1.timestamp < u1.timestamp);
  t.ok(u1.timestamp < u2.timestamp);

});

test('can #destroy', function(t){

  t.plan(2);

  var key = "name",
      c1 = builder.buildCreateRecord(),
      d1 = builder.buildDestroyRecord(c1.entity_id);


  t.ok(c1.timestamp < d1.timestamp);

  t.equal(c1.entity_id, d1.entity_id);

});


// TODO - toString / fromString ?
