/* eslint-disable */
const packages = require("./package.json");
const fs = require("fs");

packages.resolutions = {
    "string-width": "4.2.3"
};

fs.writeFileSync("package.prod.json", JSON.stringify(packages, null, 2));
