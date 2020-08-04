const chalk = require('chalk')
const lightspeed = require('../data/json/lightspeed/lsInventory.json')
const opsuiteLocation = require('../data/json/opsuite/itemsAtLocation.json')
const opsuiteMerged = require('../data/json/opsuite/opsuiteItemsMerged.json')

// Opsuite Location Items
const locationItemsTotalValue = opsuiteLocation.reduce((acc, item) => {
  return acc + (parseFloat(item.amount) * item.qoh);
}, 0);

const locationQty = opsuiteLocation.reduce((acc, item) => {
  return acc + parseFloat(item.qoh)
}, 0);

const locationCost = opsuiteLocation.reduce((acc, item) => {
  return acc + (parseFloat(item.cost) * item.qoh)
}, 0);

// Lightspeed Items
const lightspeedTotalValue = lightspeed.reduce((acc, item) => {
  return parseFloat(acc) + (parseFloat(item.Prices.ItemPrice[0].amount) * item.ItemShops.ItemShop[0].qoh);
}, 0);

const lightspeedLocationQty = lightspeed.reduce((acc, item) => {
  return parseFloat(acc) + parseFloat(item.ItemShops.ItemShop[0].qoh);
}, 0);

const lightspeedCost = lightspeed.reduce((acc, item) => {
  return parseFloat(acc) + (parseFloat(item.defaultCost) * item.ItemShops.ItemShop[0].qoh);
}, 0);

console.log(chalk.bgGreen(`There are ${opsuiteLocation.length} skus`))
console.log(chalk.bgRed('Opsuite Location Total Stock Value: ' + locationItemsTotalValue.toFixed(2)));
console.log(chalk.bgBlue(`Opsuite has ${locationQty} items in stock.`));
console.log(chalk.bgYellow(`Opsuite Total Stock Cost is ${locationCost}`));
// console.log(`Opsuie Merged Total Value: ${mergedTotalValue}`)
console.log(`----------------------------------------------------------------------------------------------`)
console.log(chalk.bgGreen(`There are ${lightspeed.length} skus`))
console.log(chalk.bgRed('Lightspeed Total Value: ' + lightspeedTotalValue.toFixed(2)));
console.log(chalk.bgBlue(`Lightspeed has ${lightspeedLocationQty} items in stock.`));
console.log(chalk.bgYellow(`Lightspeed Total Stock Cost is ${lightspeedCost}`));