// Get all categories and details from Lightspeed retail.

const { refreshToken, getAccountID } = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const axios = require("axios");
const axiosRetry = require("axios-retry");
const fs = require("fs");

axiosRetry(axios, { retries: 3 });

const getCategories = async () => {
  const token = await refreshToken();
  const accountID = await getAccountID();
  const queries = 3;
  const header = {
    Authorization: `Bearer ${token}`,
  };
  let categories = [];

  for (let i = 0; i < queries; i++) {
    setTimeout(async () => {
      try {
        const res = await axios({
          url: `https://api.lightspeedapp.com/API/Account/${accountID}/Category.json&offset=${
            i * 100
          }`,
          method: "get",
          headers: header,
        });
        console.log(`adding categories ${i * 100} through ${(i + 1) * 100}`);

        const cats = await res.data.Category;
        cats[0]
          ? (categories = categories.concat(cats))
          : categories.push(cats);

        if (i + 1 === queries) {
          fs.writeFile(
            "../data/json/lightspeed/categories.json",
            JSON.stringify(categories),
            (err) =>
              console.error(
                "There was an issue writing to categories.json..",
                err
              )
          );
          return categories;
        }
      } catch (err) {
        console.error("Oh yeah we have a problem here: ", err);
      }
    }, 2000 * i);
  }
};

getCategories();

module.exports = getCategories;
