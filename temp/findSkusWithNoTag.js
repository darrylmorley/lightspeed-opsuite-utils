const fs = require('fs')
const lsItems = require('../data/json/lightspeed/lsInventory.json')

lsItems.forEach((item) => {
  if (item.Tags === undefined) {
    fs.appendFile('../data/json/missingTags.json', item.customSku, (err) => {console.error(err)})
  }
})