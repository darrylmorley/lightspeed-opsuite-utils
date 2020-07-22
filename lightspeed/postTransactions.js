const fs = require("fs");
const axios = require("axios");
const refreshToken = require("./src/refreshToken");
const getAccountID = require("./src/getAccountID");
const lightspeedApi = "https://api.lightspeedapp.com/API";
const sales = JSON.parse(
  fs.readFileSync('./temp/transactionsToPost.json', "utf-8")
);

const setHeader = async () => {
  const token = await refreshToken()
  const header = {
    Authorization: `Bearer ${token}`,
  };
  return header
}

const postTransactions = async () => {
  const header = await setHeader()
  const accountID = await getAccountID();

  sales.forEach((item, index) => {
    setTimeout(() => {
      const postBody = item;

      const options = {
        url: `${lightspeedApi}/Account/${accountID}/Sale.json`,
        method: "post",
        headers: authHeader,
        data: postBody,
      };

      // Add a response interceptor
      axios.interceptors.response.use(function(response) {
        return response;
      }, async function(error) {
          await new Promise(function(res) {
            setTimeout(function() {res()}, 10000);
            });
      
        const originalRequest = error.config;
      
        if (error.response.status===401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshedHeader = await setHeader()
          console.log('New header: ', refreshedHeader)
          axios.defaults.headers = refreshedHeader
          originalRequest.headers = refreshedHeader
          console.log('Original Request: ', originalRequest)
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }); 

      const makeRequest = async () => {
        try {
          const res = await axios(options);
          const data = console.log(
            "Token: " + JSON.stringify(header),
            "\n",
            "Data: " + JSON.stringify(postBody),
            "\n",
            "Status: " + JSON.stringify(res.status),
            "\n"
          );
        } catch (err) {
          if (err.response.status === 400) {
            fs.appendFile('../data/errors/postTransactionErrors.json', JSON.stringify(err), (err) => console.error(err));
            return err
          }
          console.error(err.data, options);
          return;
        }
      };

      makeRequest();
    }, index * 10000);
  });
};

postTransactions();

module.exports = postTransactions;