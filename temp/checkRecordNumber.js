//Add files to check
const lightspeed = require('../data/json/lightspeed/lsInventory.json')
const opsuiteMasters = require('../data/json/opsuite/itemMasters.json')
const opsuiteLocation = require('../data/json/opsuite/itemsAtLocation.json')
const opsuiteMerged = require('../data/json/opsuite/opsuiteItemsMerged.json')

console.log(`Lightspeed has ${lightspeed.length} records.`)
console.log(`Opsuite At Location has ${opsuiteLocation.length} records.`)
console.log(`Opsuite Masters has ${opsuiteMasters.length} records.`)
console.log(`Opsuite merged has ${opsuiteMerged.length} records.`)



