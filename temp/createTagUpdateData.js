const fs = require('fs')
const lsItems = require("../data/json/lightspeed/lsInventory.json");
const items = require('../data/json/lightspeed/itemsToPost-final.json')

const merged = items.map((item) => {
  const match = item && lsItems.find((match) => match.customSku === item.customSku)

  if (match) {
    return {
      itemID: item.itemID,
      customSku: item.customSku,
      defaultCost: item.defaultCost,
      amount: item.amount,
      reorderPoint: item.reorderPoint,
      reorderLevel: item.reorderLevel,
      tag: item.tag,
      shopID: match.ItemShops.ItemShop[0].itemShopID
    }
  }
})

// binLocations.forEach(item => {
//   const match = item && opsuiteItems.find(el => el.customSku === item.customSku);

//   if (match) {
//     merged.push({
//       itemID: item.itemID,
//       customSku: item.customSku,
//       defaultCost: match.vendorCost,
//       tag: item.binLocation 
//     });
//   }
// });

// const merged = binLocations.filter((item) => {
//   return item != null && opsuiteItems.findIndex((opItem) => opItem.customSku === item.customSku) >= 0;
//   }).map((item) => { 
//     const itm = opsuiteItems.find((itm) => itm.customSku === item.customSku)
//       if (itm) {
//         return {
//           itemID: item.itemID,
//           customSku: itm.customSku,
//           defaultCost: itm.vendorCost,
//           tag: item.binLocation
//         }
//       }
//     });

fs.writeFile('../data/json/lightspeed/itemsToPost.json', JSON.stringify(merged), (err) => {console.error(err)})


