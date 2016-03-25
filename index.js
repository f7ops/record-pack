
var uuid = require('node-uuid').v4,
    Clock = require('swarm-stamp').SecondPreciseClock,
    ProtoBuf = require('protobufjs'),
    pbBuilder = ProtoBuf.loadProto(
      "syntax = \"proto3\";                                \n" +
      "message SetOperation {                              \n" +
      "  enum Type { CREATE = 1; UPDATE = 2; DESTROY = 3; }\n" +
      "                                                    \n" +
      "  required string timestamp = 1;                    \n" +
      "  required string entity_id = 2;                    \n" +
      "  required Type t = 3;                              \n" +
      "                                                    \n" +
      "  optional string key = 4;                          \n" +
      "  optional string val = 5;                          \n" +
      "}", 'index.proto'),
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
    t: 2, // 'UPDATE' in Type enum of index.proto
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
    t: 3 // 'DESTROY' in Type enum of index.proto
  });

  addTypeGetter(op);

  return op;
};

function fromString(base64str){

  var strArray = base64str
                   .split("\n")
                   .filter(function(el){ return (el.length > 0); });

  return strArray.map(function(el){
    var op = SetOperation.decode64(el);

    addTypeGetter(op);
    if (op.t == 2) { addValueGetter(op); }

    return op;
  });
}

function toString(op){
  if (Array.isArray(op)){
    return op
      .map(function(op){ return op.toBase64(); })
      .join("\n");
  } else {
    return op.toBase64();
  }
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

module.exports = {"Builder": Builder, toString: toString, fromString: fromString};



