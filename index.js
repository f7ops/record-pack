
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
    t: 1 // 'CREATE' in Type enum of index.proto
  });

  addTypeGetter(op);

  return op;
};

Builder.prototype.buildUpdateRecord = function(entity_id, key, value){
  var op = new SetOperation({
    timestamp: this.clock.issueTimestamp(),
    entity_id: entity_id,
    t: 2,
    key: key,
    val: JSON.stringify(value)
  });

  addValueGetter(op);
  addTypeGetter(op);

  return op;
};

Builder.prototype.buildDestroyRecord = function(entity_id){
  var op = new SetOperation({
    timestamp: this.clock.issueTimestamp(),
    entity_id: entity_id,
    t: 3
  });

  addTypeGetter(op);

  return op;
};

function decodeOperation(base64str){
  var op = SetOperation.decode64(base64str);

  addTypeGetter(op);

  if (op.t == 2) {
    addValueGetter(op);
  }
  return op;
}

function addValueGetter(obj){
  Object.defineProperty(obj, "value", { get: function(){ return JSON.parse(this.val); }});
}

function addTypeGetter(obj){
  Object.defineProperty(obj, "type", { get: function(){
    switch(this.t) {
      case 1:
        return 'create';
      case 2:
        return 'update';
      case 3:
        return 'destroy';
    }
  }});
}

module.exports = {"Builder": Builder, decodeOperation: decodeOperation};



