const fs = require("fs");
const chalk = require('chalk')

const mergedItems = JSON.parse(
  fs.readFileSync("../data/json/opsuiteItemsMerged.json", "utf-8")
);
const binLocations = JSON.parse(
  fs.readFileSync("../data/json/binLocations.json", "utf-8")
);

const addBinLocations = async () => {
  console.log(chalk.bgGreen.black('Merging Bin Locations to opsuiteItemsMerged'));
  
  const merged = mergedItems
    .map((item) => {
      bin = binLocations.find((bin) => item.customSku.replace(/\s*$/,"") === bin.Sku.replace(/\s*$/,""));
      if (bin) {
        return {
          customSku: item.customSku,
          description: item.description,
          itemType: "default",
          discountable: "true",
          tax: item.tax,
          qoh: item.qoh,
          defaultCost: item.avgCost,
          amount: item.amount,
          ean: item.ean,
          note: item.note,
          reorderPoint: item.reorderPoint,
          reorderLevel: item.reorderLevel,
          location: bin.BinLocation
        };
      }
    })
    .filter((itm) => itm !== undefined);

  fs.writeFile("../data/json/opsuiteItemsMerged.json", JSON.stringify(merged), (err) => {
    if (err) console.error(chalk.bgRed.black(err));
  });
  console.log(chalk.bgGreen.black('Results have been written to file opsuiteItemsMerged.json @ data/json'));
};

addBinLocations();

module.exports = addBinLocations;
