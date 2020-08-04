const opsuiteVendors = require('../data/suppliers.json')
const lightspeedVendors = require('../data/json/lightspeed/vendors.json')
const fs = require('fs');

const mergeVendors = opsuiteVendors.map((vendor) => {
  vendorLs = lightspeedVendors.find((vendorLs) => vendorLs.name === vendor.SupplierName)
  if(vendorLs) {
    return {
    "name": vendor.SupplierName,
    "Contact": {
      "Addresses": {
        "ContactAddress": {
          "address1": vendor.AddressLine1,
          "address2": vendor.AddressLine2,
          "city": vendor.City,
          "state": vendor.County,
          "zip": vendor.PostCode,
          "country": vendor.Country
        }
      },
      "Phones": {
        "ContactPhone": [
          {
            "number": vendor.TelephoneNumber,
            "useType": "Work"
          },
          {
            "number": vendor.FaxNumber,
            "useType": "Fax"
          }
        ]
      },
      "Emails": {
        "ContactEmail": {
          "address": vendor.Email,
          "useType": "Primary"
        }
      },
      "Websites": vendor.WebAddress,
      "Reps": {
        "VendorRep": {
          "firstName": vendor.FirstName,
          "lastName": vendor.LastName
        }
      }
    }
  }
  }
  }).filter((vendorLs) => vendorLs !== undefined);

  fs.writeFile("../data/json/lightspeed/vendorsToPost.json", JSON.stringify(mergeVendors), (err) => {
    if (err) console.error(chalk.bgRed.black(err));
  });
  
  console.log('Results have been written to file vendorsToPost.json @ data/json');