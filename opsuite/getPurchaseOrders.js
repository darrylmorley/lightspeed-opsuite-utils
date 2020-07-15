// Get Opsuite purchase orders by date range, filtered with Camaro

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const WSHttpBinding = require("wcf.js").WSHttpBinding;
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config();
const { transform, prettyPrint } = require("camaro");

const getOpsuiteItemMasters = () => {
  return new Promise((resolve, reject) => {
    const binding = new BasicHttpBinding({
      SecurityMode: "TransportWithMessageCredential",
      MessageClientCredentialType: "UserName",
    });

    const proxy = new Proxy(
      binding,
      "https://services.opsuite.co.uk/2013/08/PurchaseOrderService.svc/basic"
    );

    proxy.ClientCredentials.Username.Username = process.env.API_USER;
    proxy.ClientCredentials.Username.Password = process.env.API_PASS;

    let status = -1;
    let startDate = "2020-06-27T08:00:00Z";
    let endDate = "2020-06-27T20:00:00Z";

    const message =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opsuite.com/opservices/2013/08">' +
      "<soapenv:Header/>" +
      "<soapenv:Body>" +
      "<ns:GetPurchaseOrdersByDate>" +
      //`<ns:status>${status}</ns:status>` +
      `<ns:startDate>${startDate}</ns:startDate>` +
      `<ns:endDate>${endDate}</ns:endDate>` +
      "</ns:GetPurchaseOrdersByDate>" +
      "</soapenv:Body>" +
      "</soapenv:Envelope>";

    const template = {
      PurchaseOrders: [
        "//a:ExportItem",
        {
          refNum: "normalize-space(a:)",
          orderedDate: "normalize-space(a:)",
          receivedDate: "normalize-space(a:)",
          arrivalDate: "normalize-space(a:)",
          shipInstructions: "normalize-space(a:)",
          stockInstructions: "normalize-space(a:)",
          shipCost: "normalize-space(a:)",
          discount: "normalize-space(a:)",
          vendor: "normalize-space(a:)",
          shop: "normalize-space(a:)",
          itemID: "normalize-space(a:)",
          qty: "normalize-space(a:)",
          price: "normalize-space(a:)",
          originalPrice: "normalize-space(a:)",
          orderID: "normalize-space(a:)",
          numReceived: "normalize-space(a:)",
          complete: "normalize-space(a:)"
        },
      ],
    };

    const getOpsuiteItems = proxy.send(
      message,
      "http://www.opsuite.com/opservices/2013/08/IPurchaseOrderService/GetPurchaseOrdersByDate",

      async function (response, err) {
        if (response) {
          console.log(response);
          fs.writeFile("./temp/PurchaseOrders.xml", response, (err) => {
            console.error(err);
          });
          // const result = await transform(response, template);
          // const converted = JSON.stringify(result);
          // fs.writeFile(
          //   "./temp/OpsuiteBatchTransactionsExport.json",
          //   converted,
          //   (err) => {
          //     if (err) throw err;
          //   }
          // );

          resolve(response);
        }
      }
    );
  });
};

getOpsuiteItemMasters();

module.exports = getOpsuiteItemMasters;
