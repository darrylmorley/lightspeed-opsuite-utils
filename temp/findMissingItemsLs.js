//Require fs
const fs = require('fs')

// Get Opsuite Items.
const opsuiteItemsAtLocation = require('../data/json/opsuiteItemsAtLocation.json')
console.log(opsuiteItemsAtLocation.length)

// Get Opsuite Item Masters
const opsuiteItemMasters = require('../data/json/opsuiteItemMasters.json')
console.log(opsuiteItemMasters.length)

// Get Lightspeed Items.
const lightspeedItems = require('../data/json/lsInventory.json')
console.log(lightspeedItems.length)

// Find items that are missing from Lightspeed.
const missing = opsuiteItemsAtLocation.map((item) => {
  itm = lightspeedItems.find((itm) => item.customSku === itm.customSku)
  if (!itm) {
    return {
      customSku: item.customSku,
      description: item.description,
      qoh: item.qoh
    }
  }
}).filter((item) => item !== undefined);

// Merge items with Item Master data.
const data = missing.map((item) => {
  itm = opsuiteItemMasters.find((itm) => item.customSku === itm.customSku)
  if (itm) {
    return {
      customSku: item.customSku,
      description: item.description,
      Manufacturer: itm.brand,
      defaultCost: itm.cost,
      tax: itm.taxable,
      discountable: true,
      ean: itm.barcodeNumber,
      Note: itm.note,
      qoh: item.qoh,
      amount: itm.price,
      itemType: 'default',
      categoryID: itm.category
    }
  }
})

// Write missing Items to file.
fs.writeFile('../data/json/missingItemsLs.json', JSON.stringify(data), (err) => {console.error(err)})