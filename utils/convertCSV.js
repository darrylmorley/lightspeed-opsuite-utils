const csv = require("csvtojson");
const fs = require('fs')
const badSkus = require('../data/BAD-SKUS.csv')

csv()
 .fromFile(badSkus)
 .then((jsonObj) => {
    fs.appendFile('../data/json/badSkus.json', jsonOb, (err) => { console.error(err) })
 })

