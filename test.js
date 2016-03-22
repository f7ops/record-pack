var test = require('tape'),
    recordPack = require('./index.js')
    Builder = recordPack.Builder,
    builder = new Builder(),
    decode = recordPack.decodeOperation;

test('can #create', function(t){

  t.plan(4);

  var c1 = builder.buildCreateRecord(),
      c2 = builder.buildCreateRecord();

  t.equal(c1.type, 1);
  t.equal(c2.type, 1);

  t.notEqual(c1.entity_id,
             c2.entity_id);

  t.ok(c1.timestamp < c2.timestamp);

});

test('can #update', function(t){

  t.plan(10);

  var key = "name",
      c1 = builder.buildCreateRecord(),
      u1 = builder.buildUpdateRecord(c1.entity_id, key, valA = 1257),
      u2 = builder.buildUpdateRecord(c1.entity_id, key, valB = ['things', 573]);

  t.equal(u1.entity_id, c1.entity_id);
  t.equal(u2.entity_id, c1.entity_id);

  t.deepEqual(u1.value, valA);
  t.deepEqual(u2.value, valB);

  t.equal(u1.key, key);
  t.equal(u2.key, key);

  t.equal(u1.type, 2);
  t.equal(u2.type, 2);

  t.ok(c1.timestamp < u1.timestamp);
  t.ok(u1.timestamp < u2.timestamp);

});

test('can #destroy', function(t){

  t.plan(4);

  var key = "name",
      c1 = builder.buildCreateRecord(),
      d1 = builder.buildDestroyRecord(c1.entity_id);

  t.equal(c1.type, 1);
  t.equal(d1.type, 3);

  t.ok(c1.timestamp < d1.timestamp);

  t.equal(c1.entity_id, d1.entity_id);

});

test('can decode #create', function(t){
  t.plan(3);

  var record = builder.buildCreateRecord(),
      entity_id = record.entity_id,
      ts = record.timestamp;

  var decoded = decode(record.toBase64());

  t.equal(decoded.entity_id, entity_id);
  t.equal(decoded.type, 1);
  t.equal(decoded.timestamp, ts);

});

test('can decode #update', function(t){

  t.plan(5);

  var c1 = builder.buildCreateRecord(),
      record = builder.buildUpdateRecord(c1.entity_id, key = "things", value = 1250.00), // val must be number to assert correct persistance
      entity_id = record.entity_id,
      ts = record.timestamp;

  var decoded = decode(record.toBase64());

  t.equal(decoded.timestamp, ts);
  t.equal(decoded.entity_id, c1.entity_id);
  t.equal(decoded.type, 2);
  t.equal(decoded.key, key);
  t.equal(decoded.value, value);

});

test('can decode #destroy', function(t){

  t.plan(3);

  var record = builder.buildDestroyRecord(),
      entity_id = record.entity_id,
      ts = record.timestamp;

  var decoded = decode(record.toBase64());

  t.equal(decoded.entity_id, entity_id);
  t.equal(decoded.type, 3);
  t.equal(decoded.timestamp, ts);

});

