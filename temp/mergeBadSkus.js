const fs = require('fs')
const badSkus = require('../data/json/badSkus.json')
const lsItems = require('../data/json/lightspeed/lsInventory.json')

const merged = badSkus.map((item) => {
  const itm = lsItems.find((itm) => itm.customSku === item.sku)

  if(itm) {
    return {
      customSku: item.sku,
      itemID: itm.itemID
    }
  }
})

fs.writeFile('../data/json/lightspeed/badSkus.json', JSON.stringify(merged), (err) => { console.error(err) })
