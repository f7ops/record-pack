
var uuid = require('node-uuid');

function createMessage(){
  console.warn('unimplemented');
}

function updateMessage(){
  console.warn('unimplemented');

}

function removeMessage(){
  console.warn('unimplemented');

}

// pack
//
// returns a new-line separated list of base64 encoded messages
function pack(msgs){
  console.warn('unimplemented');

}

// unpack
//
// return the original array of messages from a new-line separated list of
// base64 encoded messages.
function unpack(string){
  console.warn('unimplemented');

}

module.exports = {
  createMessage: createMessage,
  updateMessage: updateMessage,
  removeMessage: removeMessage,

  pack: pack,
  unpack: unpack
};
