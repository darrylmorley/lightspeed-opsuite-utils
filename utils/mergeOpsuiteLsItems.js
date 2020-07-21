const fs = require('fs');
const chalk = require('chalk')

const mergedItems = JSON.parse(fs.readFileSync('../data/json/opsuiteItemsMerged.json', 'utf-8'))
const lightspeedItems = JSON.parse(fs.readFileSync('../data/json/lsInventory.json', 'utf-8'));

console.log(chalk.bgGreen.black('Merging Lightspeed and Opsuite Items.'))

const merged = mergedItems.map((item) => {
  itm = lightspeedItems.find((itm) => item.customSku === itm.customSku)
  if(itm) {
    return {
      id: itm.itemID,
      itemShopID: itm.ItemShops.ItemShop[0].itemShopID,
      customSku: item.customSku,
      description: item.description,
      tax: item.tax,
      discountable: true,
      itemType: item.itemType,
      qoh: item.qoh,
      amount: item.amount,
      defaultCost: item.defaultCost,
      avgCost: item.avgCost,
      reorderPoint: item.reorderPoint,
      reorderLevel: item.reorderLevel,
      ean: item.ean,
    }
  }
}).filter((item) => item !== undefined);

console.log(chalk.bgGreen.black('Writing results to file opsuiteLsMerged.json @ data/json'))

fs.writeFile('../data/json/opsuiteLsMerged.json', JSON.stringify(merged), (err) => {
  console.error(err)
})