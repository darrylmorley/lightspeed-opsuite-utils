const lightspeed = require('../data/json/lightspeed/lsInventory.json')
const opsuiteLocation = require('../data/json/opsuite/itemsAtLocation.json')
const opsuiteMerged = require('../data/json/opsuite/opsuiteItemsMerged.json')

const opsuiteItems = opsuiteMerged.map((item) => {
  console.log(item.customSku)
})