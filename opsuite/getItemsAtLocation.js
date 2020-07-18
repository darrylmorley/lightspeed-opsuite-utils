// Get items at Opsuite location, filtered with Camaro.

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config();
const { transform, prettyPrint } = require("camaro");

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

    proxy.send(
      message,
      "http://www.opsuite.com/opservices/2013/08/IInventoryService/GetItemsAtLocation",

      async function (response, err) {
        if (response) {
          fs.writeFile("./data/xml/opsuiteItemsAtLocation", response, (err) => {
            if (err) console.error(err);
          });
          const result = await transform(response, template);

          let products = result.products.filter((item) => {
            return (item.active = true);
          });

          const filteredProducts = await products.map((item) => {
            return {
              sku: item.customSku.toUpperCase(),
              price: item.price,
              quantity: item.quantity,
            };
          });

          fs.writeFile(
            "./data/json/opsuiteItemsAtLocation.json",
            JSON.stringify(filteredProducts),
            (err) => {
              if (err) console.error(err);
            }
          );
        }
      }
    );
  });
};

getItemsAtLocation();

module.exports = getItemsAtLocation;
