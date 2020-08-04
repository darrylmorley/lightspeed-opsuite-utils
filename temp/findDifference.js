const fs = require('fs');
const lightspeed = require('../data/json/lightspeed/lsInventory.json');
const opsuiteMerged = require('../data/json/opsuite/opsuiteItemsMerged.json');
const opsuiteLocation = require('../data/json/opsuite/itemsAtLocation.json')

// Find difference on key customSku against Opsuite Items at Location & Opsuite Items Merged
const difference = opsuiteLocation.filter(item => !opsuiteMerged.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase()))
const difference2 = opsuiteMerged.filter(item => !opsuiteLocation.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase()))
const result = [...difference, ...difference2]
fs.writeFile('../data/json/dif-opsLoc-opsMerged-sku.json', JSON.stringify(result), (err) => {console.error(err)})

// Find difference on key customSku against Opsuite Items at Location & Lightspeed
const differenceLs = opsuiteLocation.filter(item => !lightspeed.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase()))
const differenceLs2 = lightspeed.filter(item => !opsuiteLocation.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase()))
const result2 = [...differenceLs, ...differenceLs2]
fs.writeFile('../data/json/dif-ops-ls-sku.json', JSON.stringify(result2), (err) => {console.error(err)})

// Find difference on key qoh against Opsuite & Lightpeed
const differenceQohLs = opsuiteLocation.filter(item => !lightspeed.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && item.qoh === itm.ItemShops.ItemShop[0].qoh))
const differenceQohLs2 = lightspeed.filter(item => !opsuiteLocation.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && itm.qoh === item.ItemShops.ItemShop[0].qoh))
const resultQoh = [...differenceQohLs, ...differenceQohLs2]
fs.writeFile('../data/json/dif-ops-ls-qoh.json', JSON.stringify(resultQoh), (err) => {console.error(err)})

// Find difference on key cost against Opsuite & Lightpeed
const differenceCostLs = opsuiteLocation.filter(item => !lightspeed.some(itm => item.cost === itm.defaultCost))
const differenceCostLs2 = lightspeed.filter(item => !opsuiteLocation.some(itm => itm.cost === item.defaultCost))
const resultCost = [...differenceQohLs, ...differenceQohLs2]
fs.writeFile('../data/json/dif-ops-ls-cost.json', JSON.stringify(resultCost), (err) => {console.error(err)})

// Find difference on key qoh between Opsuite Location & Lightspeed
// const differenceLs = opsuiteLocation.filter(item => !lightspeed.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && item.qoh === itm.ItemShops.ItemShop[0].qoh))
// const differenceLs2 = lightspeed.filter(item => !opsuiteLocation.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && itm.qoh === item.ItemShops.ItemShop[0].qoh))
// const result2 = [...differenceLs, ...differenceLs2]
// fs.writeFile('../data/json/dif-opsLoc-Ls-qoh.json', JSON.stringify(result2), (err) => {console.error(err)})

// Find difference on key amount between Opsuite Location and Lightspeed
// const differenceLsAmount = opsuiteLocation.filter(item => !lightspeed.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && item.amount === itm.Price.ItemPrice[0].amount))
// const differenceLs2Amount = opsuiteLocation.filter(item => !lightspeed.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && itm.amount === item.Price.ItemPrice[0].amount))
// const result3 = [...differenceLsAmount, ...differenceLs2Amount]
// fs.writeFile('../data/json/dif-opsLoc-Ls-amount.json', JSON.stringify(result2), (err) => {console.error(err)})

// Find values that are in result1 but not in result2
// var uniqueResultOne = lightspeed.filter(function(obj) {
//   return !opsuiteLocation.some(function(obj2) {
//     return obj.amount == obj2.amount;
//   });
// });

// Find values that are in result2 but not in result1
// var uniqueResultTwo = opsuiteLocation.filter(function(obj) {
//   return !lightspeed.some(function(obj2) {
//       return obj.amount == obj2.amount;
//   });
// });

// fs.writeFile('../data/json/difference.json', JSON.stringify(result), (err) => {console.error(err)})

//Combine the two arrays of unique entries
// var result = uniqueResultOne.concat(uniqueResultTwo);

// Return Unique Items
// const difference = opsuiteLocation.filter(item => !lightspeed.some(itm => item.customSku.trim().toUpperCase() === itm.customSku.trim().toUpperCase() && item.qoh === itm.ItemShops.ItemShop[0].qoh))
// const difference = lightspeed.filter(item => !opsuiteLocation.some(itm => parseInt(itm.ItemShops.ItemShop[0].qoh) === parseInt(item.qoh)))

// Return Common Items
// const difference = lightspeed.filter(item => !opsuiteLocation.some(itm => itm.customSku.toUpperCase().trim() === item.customSku.toUpperCase().trim()))


