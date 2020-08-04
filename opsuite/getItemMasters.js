// Get all Opsuite item masters, filtered with Camaro.

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const WSHttpBinding = require("wcf.js").WSHttpBinding;
const chalk = require('chalk')
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config({path: '../.env'});
const { transform } = require("camaro");

const getOpsuiteItemMasters = () => {
  console.log(chalk.bgGreen.black('Getting Item Masters from Opsuite API'));

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

  const message =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opsuite.com/opservices/2013/08">' +
      "<soapenv:Header/>" +
      "<soapenv:Body>" +
      "<ns:GetItemMasters>" +
      "</ns:GetItemMasters>" +
      "</soapenv:Body>" +
      "</soapenv:Envelope>";
    
  const template = {
    products: [
      "//a:ItemMaster",
      {
        active: "normalize-space(a:Active)",
        customSku: "normalize-space(a:Sku)",
        description: "normalize-space(a:Description)",
        brand: "normalize-space(a:Manufacturer)",
        cost: "normalize-space(a:Cost)",
        vendorCost: "normalize-space(a:PrimaryVendorCost)",
        price: "normalize-space(a:PriceIncTax)",
        taxable: "normalize-space(a:Taxable)",
        tax: "normalize-space(a:Taxable)",
        category: "normalize-space(a:CategoryId)",
        department: "normalize-space(a:DepartmentId)",
        barcodeNumber: "normalize-space(a:BarcodeNumber)",
        quantity: "normalize-space(a:QtyInParent)",
        maxLevel: "normalize-space(a:MaxRestockLevel)",
        min: "normalize-space(a:MinReorderPoint)",
        note: "normalize-space(a:Notes)"
      }
    ]
  };

  const getOpsuiteItems = proxy.send(
      message,
      "http://www.opsuite.com/opservices/2013/08/IInventoryService/GetItemMasters",
      
      async function(response, err) {
        if (response) {
          console.log(chalk.bgGreen.black('Writing Item Masters to File opsuiteItemMasters: XML @ data/xml, JSON @ data/json'))
          
          fs.writeFile('../data/xml/opsuiteItemMasters.xml', response, (err) => {
            if (err) console.error(chalk.bgRed.black(err));
          })
          
          const result = await transform(response, template)
          
          let products = result.products.filter((item) => {
            return item.active = true;
          })
          
          fs.writeFile('../data/json/opsuite/itemMasters.json', JSON.stringify(products), (err) => {
            if (err) console.error(chalk.bgRed.black(err));
          })
      
          if (err) console.error(chalk.bgRed.black('OMG an error: ', JSON.stringify(err)));
        }
    });
  });
};

getOpsuiteItemMasters()

module.exports = getOpsuiteItemMasters
