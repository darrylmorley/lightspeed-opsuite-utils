// Find Skus that are on Opsuite but not Lightspeed

const fs = require('fs')
const lightspeedItems = JSON.parse(fs.readFileSync('../../temp/lightspeedItems.json', (err) => console.error(err)))
const opsuiteItems = JSON.parse(fs.readFileSync('../../temp/mergedOpsuiteItems.json', (err) => console.error(err)))


const result = opsuiteItems.filter(item => !lightspeedItems.some(itm => item.customSku == itm.sku))

fs.writeFile('../../temp/missingSkus.json', JSON.stringify(result), (err) => {console.error(err)})


