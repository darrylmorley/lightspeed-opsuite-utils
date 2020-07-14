const yargs = require("yargs");
const chalk = require("chalk");
const getInventory = require("./lightspeed/getInventory");

// Get Opsuite Items
yargs.command({
  command: "get-stock",
  describe: "Get Stock from API and write to file.",
  handler() {
    return async () => {
      await getInventory();
    };
  },
});

yargs.parse();
