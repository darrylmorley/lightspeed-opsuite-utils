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
  
  const setHeader = async () => {
    const token = await refreshToken()
    const header = {
      Authorization: `Bearer ${token}`,
    };
    return header
  }

  const header = await setHeader()
  const accountID = await getAccountID();
  const queries = await getQueriesNeeded();

  console.log(header);

  axios.interceptors.response.use(function(response) {
    return response;
  }, async function(error) {
      await new Promise(function(res) {
        setTimeout(function() {res()}, 2000);
       });

      const originalRequest = error.config;

      if (error.response.status===401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshedHeader = await setHeader()
        axios.defaults.headers = refreshedHeader
        originalRequest.headers = refreshedHeader
        return Promise.resolve(axios(originalRequest));
      }
      return Promise.reject(error);
    });

  const loadRelations = ["ItemShops", "Images", "CustomFieldValues", "TagRelations", "TagRelations.Tag"];
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
          console.log("Writing results to file lsInventory.json in data/json");
          fs.writeFile(
            "../data/json/lightspeed/lsInventory.json",
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
        console.error("We have a problem here: ", error.response);
      }
    }, 2000 * i);
  };
}

getInventory();

module.exports = getInventory;
