// Update Vendors.
const {
  refreshToken,
  getAccountID,
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const items = require('../data/json/lightspeed/vendorsToPost.json')
const axios = require("axios");
const fs = require("fs");

const setHeader = async () => {
  const token = await refreshToken()
  const header = {
    Authorization: `Bearer ${token}`,
  };
  return header
}

const updateVendors = async () => {  
  const accountID = await getAccountID();
  const header = await setHeader()
  
  items.forEach((item, index) => {
    setTimeout(async () => {

    const postBody = `{
      "name": "${item.name}",
      "Contact": {
        "Addresses": {
          "ContactAddress": {
            "address1": "${item.address1}",
            "address2": "${item.address2}",
            "city": "${item.city}",
            "state": "${item.state}",
            "zip": "${item.zip}",
            "country": "${item.country}"
          }
        },
        "Phones": {
          "ContactPhone": [
            {
              "number": "${item.telNumber}",
              "useType": "Work"
            },
            {
              "number": "${item.faxNumber}",
              "useType": "Fax"
            }
          ]
        },
        "Emails": {
          "ContactEmail": {
            "address": "${item.email}",
            "useType": "Primary"
          }
        },
        "Websites": "${item.website}",
        "Reps": {
          "VendorRep": {
            "firstName": "${item.repFirstName}",
            "lastName": "${item.repLastName}"
          }
        }
      }
    },`

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
        fs.appendFile('../data/errors/lightspeed/vendorUpdateErrors.json', JSON.stringify(error), (error) => console.error(error));
        return error
      }
      return Promise.reject(error);
    }); 
   
    try {
      const res = await axios({
        url: `${lightspeedApi}/Account/${accountID}/Vendor/${item.VendorID}.json`,
        method: 'put',
        headers: header,
        data: postBody
      })
      console.log(res.data)
      console.log(res.status)
      return res.data
    } catch (error) {
      console.log(error)
      if (error.response.status != 401) {
        fs.appendFile('../data/errors/lightspeed/vendorUpdateErrors.json', JSON.stringify(error), (error) => console.error(error));
        console.error('We have a problem: ', error)
        return error
      }
    }
  }, index * 10000) 
  })
}

updateVendors();

module.exports = updateVendors;