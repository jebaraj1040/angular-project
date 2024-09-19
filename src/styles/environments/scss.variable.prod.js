const fs = require("fs");

const content = `$asset_cdn_base_path: ''`;

fs.writeFileSync("src/styles/variables/_global-variable.scss", content);
