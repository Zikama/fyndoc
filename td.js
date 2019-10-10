RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, Date.now());
console.log(randexp.gen());