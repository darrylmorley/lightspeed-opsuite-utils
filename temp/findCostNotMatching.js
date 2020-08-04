const fs = require('fs')
const opsuiteItems = require('../data/json/opsuite/itemsAtLocation.json')
const lightspeedItems = require('../data/json/lightspeed/lsInventory.json')

const costNotMatching = opsuiteItems.filter(item => !lightspeedItems.some(itm => parseFloat(item.cost).toFixed(2) === parseFloat(itm.defaultCost).toFixed(2)))

fs.writeFile('../data/json/costNotMatching.json', JSON.stringify(costNotMatching), (err) => {console.error(err)})
