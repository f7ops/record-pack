
Record-pack
================

Primitives for [record-set](https://github.com/f7ops/record-set). Transactions for conflict-free set operations.

```
var RecordPack = require('record-pack'),
    builder = new RecordPack.Builder(),
    decode = new RecordPack.decode();

```

Create
-------


```
cRecord = new builder.buildCreateRecord();
// => {
//   timestamp: "4BThp+a4c7dee",
//   entity_id: "cf42f0ea-f026-11e5-bd3a-6c3be57bb446"
//   type: 'create'
// }

base64 = cRecord.toBase64(cRecord);
// => 'ChE0QlRrNyt0YXE0eDg2OWE0aRIkNjBiZjA2NjMtZWIwMi00MTI2LTk3YTYtOGJhNTIxNzA1NjViGAE='

record = decode(base64);
// => {
//   timestamp: "4BThp+a4c7dee",
//   entity_id: "cf42f0ea-f026-11e5-bd3a-6c3be57bb446"
//   type: 'create'
// }


```

Notes:

  - `timestamp` is of the lamport variety. This particular strain (from [swarm.js](http://swarmjs.github.io/articles/lamport/)) is alphanumerically sortable. No decoding of timestamp strings is required to find the total order.
  - Entity id is a randomly choosen uuid


Update
-------

```
uRecord = new builder.buildUpdateRecord("cf42f0ea-f026-11e5-bd3a-6c3be57bb446", "arr", [123, 'ABC']);
// => {
//   timestamp: '4BTsB+a4c7dee',
//   entity_id: 'cf42f0ea-f026-11e5-bd3a-6c3be57bb446',
//   type: 'update',
//   key: 'arr',
//   value: [123, 'ABC']
// }

base64 = uRecord.toBase64(uRecord);
// => 'ChE0QlR2Qyt0YXE0eDg2OWE0aRIZYW9lc3VudGgtYW9zZW50aC1hb2VzdXRuaBgCIgZ0aGluZ3MqDVsxMjUsInN0dWZmIl0='

record = decode(base64);
// => {
//   timestamp: '4BTsB+a4c7dee',
//   entity_id: 'cf42f0ea-f026-11e5-bd3a-6c3be57bb446',
//   type: 'update',
//   key: 'arr',
//   value: [123, 'ABC']
// }

```

Notes:

  - Value is the lowest common denominator of all data types, a byte array. Higher-level libraries are responsible for enforcing more specific datatypes



Destroy
------

```
dRecord = new builder.buildDestroyRecord("cf42f0ea-f026-11e5-bd3a-6c3be57bb446");
// => {
//   timestamp: '4BTtb+a4c7dee'
//   entity_id: 'cf42f0ea-f026-11e5-bd3a-6c3be57bb446',
//   type: 'destroy'
// }

base64 = dRecord.toBase64(dRecord);
// => 'ChE0QlR2eCt0YXE0eDg2OWE0aRIZYW9lc3VudGgtYW9zZW50aC1hb2VzdXRuaBgD'

record = decode(base64);
// => {
//   timestamp: '4BTtb+a4c7dee'
//   entity_id: 'cf42f0ea-f026-11e5-bd3a-6c3be57bb446',
//   type: 'destroy'
// }

```

License
-------

Copyright 2016 Will O'Brien

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
