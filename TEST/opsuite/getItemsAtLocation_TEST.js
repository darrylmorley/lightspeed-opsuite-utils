// Get items at Opsuite location, filtered with Camaro.

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config({path: '../../.env'});
const { transform, prettyPrint } = require("camaro");
const chalk = require('chalk')

const getItemsAtLocation = () => {
  return new Promise((resolve, reject) => {
    const binding = new BasicHttpBinding({
      SecurityMode: "TransportWithMessageCredential",
      MessageClientCredentialType: "UserName",
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
      "<ns:GetItemsAtLocation>" +
      "<ns:locatonId>1</ns:locatonId>" +
      "</ns:GetItemsAtLocation>" +
      "</soapenv:Body>" +
      "</soapenv:Envelope>";

    const template = {
      products: [
        "//a:ItemLocationDetail",
        {
          active: "a:Active",
          customSku: "a:Sku",
          description: "a:LocationDescription",
          defaultCost: "a:Cost",
          price: "a:PriceIncTax",
          quantity: "a:QtyOnHand",
          maxRestockLevel: "a:MaxRestockLevel",
          minReorderPoint: "a:MinReorderPoint"
        },
      ],
    };

    const getItems = proxy.send(
      message,
      "http://www.opsuite.com/opservices/2013/08/IInventoryService/GetItemsAtLocation",

      async function (response, err) {
        if (response) {
          console.log(chalk.bgGreen.black('Writing Items At Location to File opsuiteItemsAtLocation: XML @ data/xml, JSON @ data/json'))
          
          fs.writeFile("../data/xml/opsuiteItemsAtLocation.xml", response, (err) => {
            if (err) console.error(err);
          });
          
          const result = await transform(response, template);

          let products = result.products.filter((item) => {
            return (item.active = true);
          });

          const filteredProducts = await products.map((item) => {
            return {
              customSku: item.customSku.toUpperCase(),
              description: item.description,
              amount: item.price,
              qoh: item.quantity,
              reorderPoint: item.minReorderPoint,
              reorderLevel: item.maxRestockLevel
            };
          });

          fs.writeFile("../data/json/opsuiteItemsAtLocation.json", JSON.stringify(filteredProducts), (err) => {
              if (err) console.error(err);
            }
          );
          
          if (err) console.error(err)
        }
      });
  });
};

getItemsAtLocation();

module.exports = getItemsAtLocation;
