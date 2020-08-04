const fs = require('fs')
const lightspeed = require('../data/json/lightspeed/lsInventory.json');

missingTagItems = []

const missingTags = lightspeed.forEach((item) => {
  if (!item.Tags) {
    missingTagItems.push(item.customSku)
  } else if (item.Tags.tag === undefined) {
    missingTagItems.push(item.customSku)
  }
})

fs.writeFile('../data/json/missingTags.json', JSON.stringify(missingTagItems), (err) => {console.error(err)})