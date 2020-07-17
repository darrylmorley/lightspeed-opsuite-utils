// Get full Inventory from Lightspeed Retail.

const {
  refreshToken,
  getAccountID,
  getQueriesNeeded,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const axios = require("axios");
const createAuthRefreshInterceptor = require('axios-auth-refresh');
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
  }, function(error) {
      const originalRequest = error.config;
      
      if(error.status===401 && !originalRequest._retry) {
      
        originalRequest._retry = true;
      
        setTimeout(async function() {
          const refreshedHeader = await setHeader()
          console.log('New header: ', refreshedHeader)
          axios.defaults.headers = refreshedHeader
          originalRequest.headers = refreshedHeader
          console.log('Original Request: ', originalRequest)
          return axios(originalRequest)
        }, 2000);
      }
      return Promise.reject(error);
    });

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
          console.log("Writing results to file lsInventory.json in data/json");
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
        console.error("We have a problem here: ", error.response);
      }
    }, 2000 * i);
  };
}

getInventory();

module.exports = getInventory;
