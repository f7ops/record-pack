
var uuid = require('node-uuid').v4,
    Clock = require('swarm-stamp').SecondPreciseClock,
    ProtoBuf = require('protobufjs'),
    textEncoding = require('text-encoding'),
    TextEncoder = textEncoding.TextEncoder,
    TextDecoder = textEncoding.TextDecoder,
    pbBuilder = ProtoBuf.loadProtoFile('index.proto'),
    CreateRecord  = pbBuilder.build("CreateRecord"),
    UpdateRecord  = pbBuilder.build("UpdateRecord"),
    DestroyRecord = pbBuilder.build("DestroyRecord");

function Builder(){
  this.id = Math.random().toString(36).substring(7);
  this.clock = new Clock(this.id);
}

Builder.prototype.buildCreateRecord = function(){
  var cr = new CreateRecord({
    timestamp: this.clock.issueTimestamp(),
    entity_id: uuid()
  });

  return cr;
};

Builder.prototype.buildUpdateRecord = function(entity_id, key, value){
  var ur = new UpdateRecord({
    timestamp: this.clock.issueTimestamp(),
    entity_id: entity_id,
    key: key,
    value: encode(value)
  });

  Object.defineProperty(ur, "value", { get: function(){ return value; }});

  return ur;
};

Builder.prototype.buildDestroyRecord = function(entity_id){
  var dr = new DestroyRecord({
    timestamp: this.clock.issueTimestamp(),
    entity_id: entity_id
  });

  return dr;
};

function encode(value){
  var encoder = new TextEncoder('utf-8');
  return encoder.encode(JSON.stringify(value));
}

function decode(byteArr){
  var decoder = new TextDecoder('utf-8');
  return JSON.parse(decoder.decode(byteArr));
}


module.exports = {"Builder": Builder};



