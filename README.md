
Record-pack
================

Primitives for [record-set](https://github.com/f7ops/record-set). Transactions for conflict-free set operations.

```
var RecordPack = require('record-pack'),
    builder = new RecordPack.Builder(),
    encode = RecordPack.toString,
    decode = RecordPack.fromString;

c1 = builder.create();
  => {
       timestamp: "4BThp+a4c7dee",
       entity_id: "cf42f0ea-f026-11e5-bd3a-6c3be57bb446"
       type: 'create'
     }


u1 = builder.update(id, "a", 1)
  => {
       timestamp: '4BTsC+a4c7dee',
       entity_id: 'cf42f0ea-f026-11e5-bd3a-6c3be57bb446',
       type: 'update',
       key: 'a',
       value: 1
     }

d1 = builder.destroy(id);
  => {
       timestamp: '4BTtb+a4c7dee'
       entity_id: 'cf42f0ea-f026-11e5-bd3a-6c3be57bb446',
       type: 'destroy'
     }

encode(c1)
  => a674376cd7[...]5fd=

encode([u1, u2])
  => "a4c6754bfc736==\n4765cfffe74d836=="

encode(d1)
  => "4765cfffe74d836=="

```

Notes:

  - `timestamp` is of the lamport variety. This particular strain (from [swarm.js](http://swarmjs.github.io/articles/lamport/)) is alphanumerically sortable. No decoding of timestamp strings is required to find the total order.
  - Entity id is a randomly choosen uuid
  - Value is the lowest common denominator of all data types, a byte array. Higher-level libraries are responsible for enforcing more specific datatypes


License
-------

Copyright 2016 Will O'Brien

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
