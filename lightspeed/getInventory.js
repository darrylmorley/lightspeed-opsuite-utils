const {
  refreshToken,
  getAccountID,
  getQueriesNeeded,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const axios = require("axios");
const fs = require("fs");

const getInventory = async () => {
  const token = await refreshToken();
  const accountID = await getAccountID();
  const queries = await getQueriesNeeded();
  const header = {
    Authorization: `Bearer ${token}`,
  };
  const loadRelations = ["ItemShops", "Images", "CustomFieldValues"];
  let fullInventory = [];

  for (let i = 0; i < queries; i++) {
    setTimeout(async () => {
      try {
        const res = await axios({
          url: `${lightspeedApi}/Account/${accountID}/Item.json?load_relations=${JSON.stringify(
            loadRelations
          )}&offset=${i * 100}&customSku=!~,`,
          method: "get",
          headers: header,
        });
        console.log(`adding items ${i * 100} through ${(i + 1) * 100}`);
        const items = await res.data.Item;
        items[0]
          ? (fullInventory = fullInventory.concat(items))
          : fullInventory.push(items);

        if (i + 1 === queries) {
          fs.writeFile(
            "../data/json/lsInventory.json",
            JSON.stringify(fullInventory),
            (err) =>
              console.error(
                "There was an issue writing to lsInventory.json..",
                err
              )
          );
          return fullInventory;
        }
      } catch (err) {
        if (condition) {
        } else {
          console.error("Oh yeah we have a problem here: ", err);
        }
      }
    }, 2000 * i);
  }
};

getInventory();

module.exports = getInventory;
