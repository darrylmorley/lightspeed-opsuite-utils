const fs = require("fs");
const axios = require("axios");
const {
  refreshToken,
  getAccountID
} = require("./base/getRequired");
const lightspeedApi = "https://api.lightspeedapp.com/API";

const getEmployees = async () => {
  const token = await refreshToken();
  const accountID = await getAccountID();

  const options = {
    url: `${lightspeedApi}/Account/${accountID}/Employee.json`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const makeRequest = async () => {
    try {
      const res = await axios(options);
      const data = JSON.stringify(res.data);
      fs.writeFile("../data/json/lightspeed/Employees.json", data, (err) => {
        console.log(err);
      });
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  makeRequest();
};


getEmployees();

module.exports = getEmployees;
