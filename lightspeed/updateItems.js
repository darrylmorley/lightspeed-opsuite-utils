const {
  refreshToken,
  getAccountID,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const items = require('../data/json/', 'utf-8')
const axios = require("axios");
const fs = require("fs");

const postBody = `{
  "ean": ${item.ean},
  "defaultCost": ${item.cost},
  "ItemShops": {
    "ItemShop": [
      {
        "itemShopID": ${item.itemShopID},
        "qoh": ${item.qoh}
      }
    ]
  },
  "Prices": {
    "ItemPrice": [
      {
        amount: ${item.amount},
      }
    ]
  }
}`;

const updateItems = async () => {
  const token = await refreshToken();
  const accountID = await getAccountID();
  const header = {
    Authorization: `Bearer ${token}`,
  };

  items.forEach((item) => {
    setTimeout(() => {
      try {
        const res = await axios({
          url: `${lightspeedApi}/API/Account/${accountID}/Item/${itemID}.json`,
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
  })
}

updateItems();

module.exports = updateItems;
