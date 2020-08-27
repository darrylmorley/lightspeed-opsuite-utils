const fs = require("fs");
const chalk = require('chalk')

const opsuiteItemMasters = JSON.parse(
  fs.readFileSync("../data/json/opsuite/itemMasters.json", "utf-8")
);
const opsuiteItemsAtLocation = JSON.parse(
  fs.readFileSync("../data/json/opsuite/itemsAtLocation.json", "utf-8")
);

const mergeOpsuiteItems = async () => {
  console.log(chalk.bgGreen.black('Merging Opsuite Item Masters & Opsuite Items At Location'));
  
  const merged = opsuiteItemMasters
    .map((item) => {
      itm = opsuiteItemsAtLocation.find((itm) => itm.customSku.trim() === item.customSku.trim());
      if (itm) {
        return {
          customSku: item.customSku,
          description: itm.description,
          itemType: "default",
          discountable: "true",
          tax: item.taxable,
          qoh: itm.qoh,
          defaultCost: item.vendorCost,
          avgCost: item.cost,
          amount: itm.amount,
          ean: item.barcodeNumber,
          note: item.note,
          reorderPoint: itm.reorderPoint,
          reorderLevel: itm.reorderLevel,
          category: item.category
        };
      } 
    }).filter((itm) => itm !== undefined);

  fs.writeFile("../data/json/opsuite/opsuiteItemsMerged.json", JSON.stringify(merged), (err) => {
    if (err) console.error(chalk.bgRed.black(err));
  });
  console.log(chalk.bgGreen.black('Results have been written to file opsuiteItemsMerged.json @ data/json'));
};

mergeOpsuiteItems();

module.exports = mergeOpsuiteItems;
