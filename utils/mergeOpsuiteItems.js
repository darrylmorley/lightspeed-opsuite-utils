const fs = require("fs");
let opsuiteItemMasters = JSON.parse(
  fs.readFileSync("./data/json/opsuiteItemMasters.json", "utf-8")
);
let opsuiteItemsAtLocation = JSON.parse(
  fs.readFileSync("./data/json/opsuiteItemsAtLocation.json", "utf-8")
);

const mergeOpsuiteItems = async () => {
  const merged = opsuiteItemMasters
    .map((item) => {
      itm = opsuiteItemsAtLocation.find((itm) => itm.sku.replace(/\s*$/,"") === item.customSku.replace(/\s*$/,""));
      if (itm) {
        return {
          defaultCost: item.cost,
          discountable: "true",
          tax: item.taxable,
          itemType: "default",
          description: item.description,
          ean: item.barcodeNumber,
          customSku: item.customSku,
          amount: item.price,
          qty: itm.quantity
        };
      }
    })
    .filter((itm) => itm !== undefined);

  fs.writeFile("./data/json/opsuiteItemsMerged.json", JSON.stringify(merged), (err) => {
    if (err) throw error;
  });
};

mergeOpsuiteItems();

module.exports = mergeOpsuiteItems;
