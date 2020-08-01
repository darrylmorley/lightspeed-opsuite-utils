const opsuiteItemMasters = require('../data/json/opsuiteItemMasters.json')
const opsuiteItemsAtLocation = require('../data/json/opsuiteItemsAtLocation.json')
const opsuiteItemsMerged = require('../data/json/opsuiteItemsMerged.json')
const lsInventory = require('../data/json/lsInventory.json')
const opsuiteLsMerged = require('../data/json/opsuiteLsMerged.json')

console.log(opsuiteItemMasters.length)
console.log(opsuiteItemsAtLocation.length)
console.log(opsuiteItemsMerged.length)
console.log(lsInventory.length)
console.log(opsuiteLsMerged.length)

opsuiteItemsAtLocation.forEach((item) => {
  if (item.customSku === null) {
    console.log(item)
  }
})
