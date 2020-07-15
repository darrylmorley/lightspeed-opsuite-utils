const fs = require('fs');
const mergedItems = JSON.parse(fs.readFileSync('./temp/mergedOpsuiteItems.json', 'utf-8'))
const lightspeedItems = JSON.parse(fs.readFileSync('./temp/lightspeedItems.json', 'utf-8'));


const merged = mergedItems.map((item) => {
  itm = lightspeedItems.find((itm) => item.customSku === itm.sku)
  if(itm) {
    return {
      id: itm.id,
      customSku: item.customSku,
      description: item.description,
      ean: item.ean,
      tax: item.tax,
      qoh: item.qty,
      amount: item.amount,
      discountable: true,
      defaultCost: item.defaultCost
    }
  }
}).filter((item) => item !== undefined);

fs.writeFile('./temp/mergedOpsuiteLightspeed.json', JSON.stringify(merged), (err) => {
  console.error(err)
})