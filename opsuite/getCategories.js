// Get all categories, names & id's from Opsuite.

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const WSHttpBinding = require("wcf.js").WSHttpBinding;
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config({path: '../.env'});
const { transform } = require("camaro");

const getCategories = () => {
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
   '<soapenv:Header/>'+
   '<soapenv:Body>'+
      '<ns:GetCategoryNames>'+
      '</ns:GetCategoryNames>'+
   '</soapenv:Body>'+
'</soapenv:Envelope>'

const template = {
  categories: ["//a:Category",
    {
      id: "normalize-space(a:Id)",
      categoryCode: "normalize-space(a:CategoryCode)",
      categoryName: "normalize-space(a:CategoryName)"
    }
  ]
};

const get = proxy.send(
  message,
  "http://www.opsuite.com/opservices/2013/08/IInventoryService/GetCategoryNames",
  
  async function(response, err) {
    if (response) {
      fs.writeFile('../data/xml/opsuiteCategories.xml', response, (err) => {
        if (err) console.error(err)
      })

      const result = await transform(response, template)

      fs.writeFile('../data/json/opsuite/categories.json', JSON.stringify(result), (err) => {console.error(err)})

      resolve(response)
    }
    if (err) {console.error('OMG an error: ', err)}
    });
  })
}

getCategories()

module.exports = getCategories