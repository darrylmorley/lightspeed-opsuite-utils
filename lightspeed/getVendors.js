// Get all vendors form Lightspeed Retail

const { refreshToken, getAccountID } = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const axios = require("axios");
const fs = require("fs");

const getVendors = async () => {
  const token = await refreshToken();
  const accountID = await getAccountID();
  const queries = 2;
  const header = {
    Authorization: `Bearer ${token}`,
  };
  let vendors = [];

  for (let i = 0; i < queries; i++) {
    setTimeout(async () => {
      try {
        const res = await axios({
          url: `https://api.lightspeedapp.com/API/Account/218964/Vendor.json&offset=${
            i * 100
            }`,
          method: "get",
          headers: header,
        });
        console.log(`adding categories ${i * 100} through ${(i + 1) * 100}`);

        const Vendor = await res.data.Vendor;
        Vendor[0]
          ? (vendors = vendors.concat(Vendor))
          : vendors.push(Vendor);

        if (i + 1 === queries) {
          fs.writeFile(
            "../data/json/lightspeed/vendors.json",
            JSON.stringify(vendors),
            (err) =>
              console.error(
                "There was an issue writing to vendors.json..",
                err
              )
          );
          return vendors;
        }
      } catch (err) {
        console.error("Oh yeah we have a problem here: ", err);
      }
    }, 2000 * i);
  }
};

getVendors();

module.exports = getVendors;
