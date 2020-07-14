const { refreshToken, getAccountID } = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const axios = require("axios");
const axiosRetry = require("axios-retry");
const fs = require("fs");

axiosRetry(axios, { retries: 3 });

const getManufacturers = async () => {
  const token = await refreshToken();
  const accountID = await getAccountID();
  const queries = 2;
  const header = {
    Authorization: `Bearer ${token}`,
  };
  let manufacturers = [];

  for (let i = 0; i < queries; i++) {
    setTimeout(async () => {
      try {
        const res = await axios({
          url: `https://api.lightspeedapp.com/API/Account/218964/Manufacturer.json&offset=${
            i * 100
            }`,
          method: "get",
          headers: header,
        });
        console.log(`adding categories ${i * 100} through ${(i + 1) * 100}`);

        const Manufacturer = await res.data.Manufacturer;
        Manufacturer[0]
          ? (manufacturers = manufacturers.concat(Manufacturer))
          : manufacturers.push(Manufacturer);

        if (i + 1 === queries) {
          fs.writeFile(
            "../data/json/manufacturers.json",
            JSON.stringify(manufacturers),
            (err) =>
              console.error(
                "There was an issue writing to manufacturers.json..",
                err
              )
          );
          return manufacturers;
        }
      } catch (err) {
        console.error("Oh yeah we have a problem here: ", err);
      }
    }, 2000 * i);
  }
};

getManufacturers();

module.exports = getManufacturers;
