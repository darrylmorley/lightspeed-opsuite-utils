const fs = require('fs')
const lightspeedItems = JSON.parse(fs.readFileSync('../data/json/lsInventory.json', (err) => console.error(err)))
const opsuiteItems = JSON.parse(fs.readFileSync('../data/json/opsuiteItemsAtLocation.json', (err) => console.error(err)))


const result = opsuiteItems.filter(item => !lightspeedItems.some(itm => item.sku == itm.customSku))

const aboveZero = result.filter((item) => {
  if (item.quantity > 0) {
    return item
  }
})

fs.writeFile('../data/json/missingSkus.json', JSON.stringify(aboveZero), (err) => { console.error(err) })


