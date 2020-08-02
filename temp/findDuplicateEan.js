const items = require('../data/json/lsInventory.json');
const fs = require('fs')

let duplicates = items
  .filter((el,index)=> {
    let isDuplicate = index !== items.findIndex(({ean,sku})=> el.ean === ean && el.sku === sku);
    return isDuplicate});
  
fs.writeFile('../data/errors/eanDuplicates.json', JSON.stringify(duplicates), (err) => console.error(err))