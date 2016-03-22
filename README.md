
Record-pack
================

Primitives for [record-set](https://github.com/f7ops/record-set). Provide a structure on which conflict-free operations can be performed on a set.

```
let builder = new Builder()
```

Create
-------

```
builder.buildCreateRecord()
// => createRecord({timestamp: "stnhsnth#aoekcrg", "entity_id": "rcaeohk-aoeurcgk-aoeklrcg"  })
```

Notes:

  - `timestamp` is of the lamport variety. This particular strain (from [swarm.js](http://swarmjs.github.io/articles/lamport/)) is alphanumerically sortable. No decoding of base64 timestamps is required for finding the total order.
  - Entity is a randomly choosen uuid


Update
-------

```
builder.buildUpdateRecord()
// => updateRecord({timestamp: "!8V7N809+Walt~ssn", "entity_id": "3dfc6f4a-ef5d-11e5-a940-6c3be57bb446", "key": "some-property", value: [0x00,0xFF,0xF8]  })
```

Notes:

  - Value is the lowest common denominator of all data types, a byte array. Higher-level libraries are responsible for enforcing more specific datatypes



Destroy
------

```
builder.buildDestroyRecord()
// => destroyRecord({timestamp: "!8V7N810+Walt~ssn", entity_id: "3dfc6f4a-ef5d-11e5-a940-6c3be57bb446"})
```

License
-------

Copyright 2016 Will O'Brien

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
