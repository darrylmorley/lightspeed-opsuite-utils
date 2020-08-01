const fs = require("fs");
const chalk = require('chalk')

const opsuiteItemMasters = JSON.parse(
  fs.readFileSync("../data/json/opsuiteItemMasters.json", "utf-8")
);
const opsuiteItemsAtLocation = JSON.parse(
  fs.readFileSync("../data/json/opsuiteItemsAtLocation.json", "utf-8")
);

const mergeOpsuiteItems = async () => {
  console.log(chalk.bgGreen.black('Merging Opsuite Item Masters & Opsuite Items At Location'));
  
  const merged = opsuiteItemMasters
    .map((item) => {
      itm = opsuiteItemsAtLocation.find((itm) => itm.customSku.replace(/\s*$/,"") === item.customSku.replace(/\s*$/,""));
      if (itm) {
        return {
          customSku: item.customSku,
          description: item.description,
          itemType: "default",
          discountable: "true",
          tax: item.taxable,
          qoh: itm.qoh,
          defaultCost: item.vendorCost,
          avgCost: item.cost,
          amount: item.price,
          ean: item.barcodeNumber,
          note: item.note,
          reorderPoint: itm.reorderPoint,
          reorderLevel: itm.reorderLevel,
          category: item.category
        };
      } 
    })
    .filter((itm) => itm !== undefined);

  fs.writeFile("../data/json/opsuiteItemsMerged.json", JSON.stringify(merged), (err) => {
    if (err) console.error(chalk.bgRed.black(err));
  });
  console.log(chalk.bgGreen.black('Results have been written to file opsuiteItemsMerged.json @ data/json'));
};

mergeOpsuiteItems();

module.exports = mergeOpsuiteItems;
