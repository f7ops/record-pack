var test = require('tape'),
    recordPack = require('./index.js'),
    Builder = recordPack.Builder,
    builder = new Builder(),
    decode = recordPack.fromString,
    encode = recordPack.toString;

test('can #create', function(t){

  var c1 = builder.create(),
      c2 = builder.create();

  t.equal(c1.type, 'create');
  t.equal(c2.type, 'create');

  t.notEqual(c1.entity_id,
             c2.entity_id);

  t.ok(c1.timestamp < c2.timestamp);

  t.end();

});

test('can #update', function(t){

  var key = "name",
      c1 = builder.create(),
      u1 = builder.update(c1.entity_id, key, valA = 1257),
      u2 = builder.update(c1.entity_id, key, valB = ['things', 573]);

  t.equal(u1.entity_id, c1.entity_id);
  t.equal(u2.entity_id, c1.entity_id);

  t.deepEqual(u1.value, valA);
  t.deepEqual(u2.value, valB);

  t.equal(u1.key, key);
  t.equal(u2.key, key);

  t.equal(u1.type, 'update');
  t.equal(u2.type, 'update');

  t.ok(c1.timestamp < u1.timestamp);
  t.ok(u1.timestamp < u2.timestamp);

  t.end();

});

test('can #destroy', function(t){

  var key = "name",
      c1 = builder.create(),
      d1 = builder.destroy(c1.entity_id);

  t.equal(c1.type, 'create');
  t.equal(d1.type, 'destroy');

  t.ok(c1.timestamp < d1.timestamp);

  t.equal(c1.entity_id, d1.entity_id);

  t.end();

});

test('can decode #create', function(t){

  var record = builder.create(),
      entity_id = record.entity_id,
      ts = record.timestamp;

  var decoded = decode(encode(record));

  t.equal(decoded.length, 1);

  t.equal(decoded[0].entity_id, entity_id);
  t.equal(decoded[0].type, 'create');
  t.equal(decoded[0].timestamp, ts);

  t.end();

});

test('can decode #update', function(t){

  var c1 = builder.create(),
      record = builder.update(c1.entity_id, key = "things", value = 1250.00), // val must be number to assert correct persistance
      entity_id = record.entity_id,
      ts = record.timestamp;

  var decoded = decode(encode(record));

  t.equal(decoded.length, 1);

  t.equal(decoded[0].timestamp, ts);
  t.equal(decoded[0].entity_id, c1.entity_id);
  t.equal(decoded[0].type, 'update');
  t.equal(decoded[0].key, key);
  t.equal(decoded[0].value, value);

  t.end();

});

test('can decode #destroy', function(t){

  var record = builder.destroy(),
      entity_id = record.entity_id,
      ts = record.timestamp;

  var decoded = decode(encode(record));

  t.equal(decoded.length, 1);

  t.equal(decoded[0].entity_id, entity_id);
  t.equal(decoded[0].type, 'destroy');
  t.equal(decoded[0].timestamp, ts);

  t.end();

});

test('can decode several records', function(t){
  var c1 = builder.create(),
      u1 = builder.update(c1.id, key = "things", value = 4537),
      d1 = builder.destroy(c1.id);

  var decoded = decode(encode([c1, u1, d1]));

  t.equal(decoded[0].id, c1.id);
  t.equal(decoded[0].type, 'create');
  t.equal(decoded[0].timestamp, c1.timestamp);

  t.equal(decoded[1].id, c1.id);
  t.equal(decoded[1].type, 'update');
  t.equal(decoded[1].timestamp, u1.timestamp);
  t.equal(decoded[1].key, key);
  t.equal(decoded[1].value, value);

  t.equal(decoded[2].id, d1.id);
  t.equal(decoded[2].type, 'destroy');
  t.equal(decoded[2].timestamp, d1.timestamp);

  t.end();

});

test('can encode several records', function(t){
  var c1 = builder.create(),
      u1 = builder.update(c1.id, key = "things", value = 4537),
      d1 = builder.destroy(c1.id);

  var str = encode([c1, u1, d1]);

  t.equal(str.split("\n").length, 3);

  t.end();
});

test('string encoded records are newline separated and independent', function(t){
  var c1 = builder.create(),
      u1 = builder.update(c1.id, key = "things", value = 4537),
      d1 = builder.destroy(c1.id);

  var firstTwoLines = encode([c1, u1, d1]).split("\n").slice(0, 2).join("\n"),
      lastLine      = encode([c1, u1, d1]).split("\n").slice(2   ).join("\n");

  var decoded = decode(firstTwoLines);

  t.equal(decoded.length, 2);

  t.equal(decoded[0].id, c1.id);
  t.equal(decoded[0].type, 'create');
  t.equal(decoded[0].timestamp, c1.timestamp);

  t.equal(decoded[1].id, c1.id);
  t.equal(decoded[1].type, 'update');
  t.equal(decoded[1].timestamp, u1.timestamp);
  t.equal(decoded[1].key, key);
  t.equal(decoded[1].value, value);

  decoded = decode(lastLine);

  t.equal(decoded.length, 1);

  t.equal(decoded[0].id, d1.id);
  t.equal(decoded[0].type, 'destroy');
  t.equal(decoded[0].timestamp, d1.timestamp);

  t.end();

});
