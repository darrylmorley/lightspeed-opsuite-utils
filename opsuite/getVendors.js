// Get all categories, names & id's from Opsuite.

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const WSHttpBinding = require("wcf.js").WSHttpBinding;
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config({path: '../.env'});
const { transform } = require("camaro");

const getVendors = () => {
  return new Promise((resolve, reject) => {
    const binding = new BasicHttpBinding({
    SecurityMode: "TransportWithMessageCredential",
    MessageClientCredentialType: "UserName"
  });

const proxy = new Proxy(
    binding,
    "https://services.opsuite.co.uk/2013/08/InventoryService.svc/basic"
  );

  proxy.ClientCredentials.Username.Username = process.env.API_USER;
  proxy.ClientCredentials.Username.Password = process.env.API_PASS;

const message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opsuite.com/opservices/2013/08">'+
'<soapenv:Header/>' +
'<soapenv:Body>' +
   '<ns:GetVendors/>' +
'</soapenv:Body>' +
'</soapenv:Envelope>'

const get = proxy.send(
  message,
  "http://www.opsuite.com/opservices/2013/08/IInventoryService/GetVendors",
  
  async function(response, err) {
    if (response) {
      fs.writeFile('../data/xml/opsuiteVendors.xml', response, (err) => {
        if (err) console.error(err)
      })
      resolve(response)
    }
    if (err) {console.error('OMG an error: ', err)}
    });
  })
}

getVendors()

module.exports = getVendors