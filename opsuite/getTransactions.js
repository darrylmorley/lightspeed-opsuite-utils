// Get Opsuite transactions by the date specified in the startDate & endDate variables.

const BasicHttpBinding = require("wcf.js").BasicHttpBinding;
const WSHttpBinding = require("wcf.js").WSHttpBinding;
const fs = require("fs");
const Proxy = require("wcf.js").Proxy;
const dotenv = require("dotenv").config({path: '../.env'});
const { transform, prettyPrint } = require("camaro");

const getOpsuiteItemMasters = () => {
  return new Promise((resolve, reject) => {
    const binding = new BasicHttpBinding({
      SecurityMode: "TransportWithMessageCredential",
      MessageClientCredentialType: "UserName",
    });

    const proxy = new Proxy(
      binding,
      "https://services.opsuite.co.uk/2013/08/BatchExportService.svc/basic"
    );

    proxy.ClientCredentials.Username.Username = process.env.API_USER;
    proxy.ClientCredentials.Username.Password = process.env.API_PASS;

    let exportType = "ExportItems";
    let status = "BatchAll";
    let startDate = "2020-01-01T07:00:00Z";
    let endDate = "2020-12-31T20:00:00Z";

    const message =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opsuite.com/opservices/2013/08">' +
      "<soapenv:Header/>" +
      "<soapenv:Body>" +
      "<ns:GLExportByLocationIdAndBatchStatus>" +
      `<ns:exportType>${exportType}</ns:exportType>` +
      "<ns:locationId>1</ns:locationId>" +
      `<ns:status>${status}</ns:status>` +
      `<ns:startDate>${startDate}</ns:startDate>` +
      `<ns:endDate>${endDate}</ns:endDate>` +
      // "<ns:lastBatchNumber>?</ns:lastBatchNumber>" +
      "</ns:GLExportByLocationIdAndBatchStatus>" +
      "</soapenv:Body>" +
      "</soapenv:Envelope>";

    const template = {
      batchId: "//a:ExportBatch/a:BatchId",
      transactions: [
        "//a:ExportItem",
        {
          transactionID: "normalize-space(a:TransactionId)",
          opsuiteTransactionId:
            "normalize-space(a:ExternalTransactionNumber)",
          cashierName: "normalize-space(a:CashierName)",
          sku: "normalize-space(a:Sku)",
          description: "normalize-space(a:Description)",
          qty: "normalize-space(a:Quantity)",
          discountReason:
            "normalize-space(a:Benefits/a:ExportItemBenefit/a:BenefitType)",
          discount: "normalize-space(a:Benefits/a:ExportItemBenefit/a:Saving)",
          note: "normalize-space(a:Comment)",
          unitPrice: "normalize-space(a:RegularUnitPrice)",
          cost: "normalize-space(a:Cost)",
          netLineSale: "normalize-space(a:NetLineSales)",
          lineSaleValue: "normalize-space(a:Sales)",
          tax: "normalize-space(a:Tax)",
          taxCode: "normalize-space(a:TaxCode)",
          totalSale: [
            "a:Tenders/a:ExportTender",
            {
              value: "a:Value",
            },
          ],
          receiptDate: "normalize-space(a:ReceiptDate)",
          tenderDescription: "normalize-space(a:TenderDescription)",
          tenderType: "normalize-space(a:TenderType)",
        },
      ],
    };

    const getOpsuiteItems = proxy.send(
      message,
      "http://www.opsuite.com/opservices/2013/08/IBatchExportService/GLExportByLocationIdAndBatchStatus",

      async function (response, err) {
        if (response) {
          fs.writeFile("../data/xml/opsuiteTransactions-2020.xml", response, (err) => {
            if (err) throw err;
          });
          
          const result = await transform(response, template);
          
          const converted = JSON.stringify(result);
          
          fs.writeFile(
            "../data/json/opsuiteTransactions-2020.json", converted, (err) => {
              if (err) throw err;
            }
          );

          resolve(response);
        }
      });
  });
};

getOpsuiteItemMasters();

module.exports = getOpsuiteItemMasters;
