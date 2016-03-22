
var uuid = require('node-uuid').v4,
    Clock = require('swarm-stamp').SecondPreciseClock,
    ProtoBuf = require('protobufjs'),
    pbBuilder = ProtoBuf.loadProtoFile('index.proto'),
    SetOperation = pbBuilder.build("SetOperation");

function Builder(){
  this.id = Math.random().toString(36).substring(7);
  this.clock = new Clock(this.id);
}

Builder.prototype.buildCreateRecord = function(){
  var op = new SetOperation({
    timestamp: this.clock.issueTimestamp(),
    entity_id: uuid(),
    type: 1 // 'CREATE' in Type enum of index.proto
  });

  return op;
};

Builder.prototype.buildUpdateRecord = function(entity_id, key, value){
  var op = new SetOperation({
    timestamp: this.clock.issueTimestamp(),
    entity_id: entity_id,
    type: 2,
    key: key,
    val: JSON.stringify(value)
  });

  Object.defineProperty(op, "value", { get: function(){ return JSON.parse(this.val); }});

  return op;
};

Builder.prototype.buildDestroyRecord = function(entity_id){
  var op = new SetOperation({
    timestamp: this.clock.issueTimestamp(),
    entity_id: entity_id,
    type: 3
  });

  return op;
};

function decodeOperation(base64str){
  var op = SetOperation.decode64(base64str);
  if (op.type == 2) {
    Object.defineProperty(op, "value", { get: function(){ return JSON.parse(this.val); }});
  }
  return op;
}

module.exports = {"Builder": Builder, decodeOperation: decodeOperation};



