// Update items as per postBody.

const {
  refreshToken,
  getAccountID,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const items = require('../data/json/opsuiteLsMerged.json', 'utf-8')
const axios = require("axios");
const fs = require("fs");

const updateItems = async () => {
  
  const setHeader = async () => {
    const token = await refreshToken()
    const header = {
      Authorization: `Bearer ${token}`,
    };
    return header
  }
  
  const accountID = await getAccountID();
  const header = await setHeader()
  
  items.forEach((item) => {
    const postBody = `{
      "ean": "${item.ean}",
      "defaultCost": "${item.defaultCost}",
      "tax": "true",
      "itemType": "default",
      "ItemShops": {
        "ItemShop": [
          {
            "itemShopID": "${item.itemShopID}",
            "qoh": "${item.qoh}",
            "reorderPoint": "${item.reorderPoint}",
            "reorderLevel": "${item.reorderLevel}"
          }
        ]
      },
      "Prices": {
        "ItemPrice": [
          {
            "useTypeID": "1",
            "useType": "Default",
            "amount": "${item.amount}"
          }
        ]
      }
    }`;

    setTimeout(async () => {
      try {
        const res = await axios({
          url: `${lightspeedApi}/API/Account/${accountID}/Item/${item.id}.json`,
          method: 'put',
          headers: header
        })
        console.log(res.data)
        return res.data
      } catch (err) {
        if (err) console.error('We have a problem: ', err)
        return err;
      }
    }, 10000)

    axios.interceptors.response.use(function(response) {
      return response;
    }, async function(error) {
        await new Promise(function(res) {
          setTimeout(function() {res()}, 10000);
         });
  
      const originalRequest = error.config;
  
      if (error.response.status===401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshedHeader = await setHeader()
        console.log('New header: ', refreshedHeader)
        axios.defaults.headers = refreshedHeader
        originalRequest.headers = refreshedHeader
        console.log('Original Request: ', originalRequest)
        return axios(originalRequest);
      }
      return Promise.reject(error);
    });  
  })
}

updateItems();

module.exports = updateItems;
