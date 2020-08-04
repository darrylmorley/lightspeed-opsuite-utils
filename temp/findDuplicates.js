const items = require('../data/json/opsuite/opsuiteItemsMerged.json');
const fs = require('fs')

const findDuplicates = items.reduce((acc, item) => {
  acc[item.customSku] = ++acc[item.customSku] || 0;
  return acc
}, {});

const duplicates = items.filter(item => findDuplicates[item.customSku]);

fs.writeFile('../data/errors/opsuite/duplicates.json', JSON.stringify(duplicates), (err) => console.error(err))