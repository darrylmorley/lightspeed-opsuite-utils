// Get full Inventory from Lightspeed Retail.

const {
  refreshToken,
  getAccountID,
  getQueriesNeeded,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const axios = require("axios");
const fs = require("fs");

const getInventory = async () => {
  let token = await refreshToken();
  console.log(token)
  let accountID = await getAccountID();
  const queries = await getQueriesNeeded();
  const header = {
    Authorization: `Bearer ${token}`,
  };

  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      if (error.config && error.response && error.response.status === 401) {
        const token = await refreshToken();
        error.config.headers[Authorization] = `Bearer ${token.token}`;
        return axios.request(error.config);
      }

      return Promise.reject(error);
    },
  );

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
          console.log('Writing results to file lsInventory.json in data/json')
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
      } catch (error) {
        console.error("Oh yeah we have a problem here: ", error.response.data);
      }
    }, 2000 * i);
  }
};

getInventory();

module.exports = getInventory;
