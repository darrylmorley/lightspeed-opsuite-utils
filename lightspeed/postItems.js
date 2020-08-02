// Update items as per postBody.

const {
  refreshToken,
  getAccountID,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const items = require('../data/json/missingItemsLs.json')
const axios = require("axios");
const fs = require("fs");

const setHeader = async () => {
  const token = await refreshToken()
  const header = {
    Authorization: `Bearer ${token}`,
  };
  return header
}

const updateItems = async () => {  
  const accountID = await getAccountID();
  const header = await setHeader()
  
  items.forEach((item, index) => {
    setTimeout(async () => {

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
      }  else if (error.response.status != 401) {
        fs.appendFile('../data/errors/itemPostErrors.json', JSON.stringify(error), (error) => console.error(error));
        return error
      }
      return Promise.reject(error);
    }); 
   
    try {
      const res = await axios({
        url: `${lightspeedApi}/Account/${accountID}/Item.json`,
        method: 'post',
        headers: header,
        data: item
      })
      console.log(res.data)
      console.log(res.status)
      return res.data
    } catch (error) {
      console.log(error)
      if (error.response.status != 401) {
        fs.appendFile('../data/errors/itemPostErrors.json', JSON.stringify(error), (error) => console.error(error));
        console.error('We have a problem: ', error)
        return error
      }
    }
  }, index * 10000) 
  })
}

updateItems();

module.exports = updateItems;