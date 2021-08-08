#!/usr/bin/env node

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fs = require("fs");

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const tsj = require("ts-json-schema-generator");

if (!fs.existsSync("./.schema")) fs.mkdirSync("./.schema");

const tasks = ["Response", "Error", "PointType"].map((type) => {
  const config = {
    path: "./src/types.ts",
    type,
    topRef: false,
    jsDoc: "extended",
  };
  const schema = tsj.createGenerator(config).createSchema(config.type);
  const schemaString = JSON.stringify(schema, null, 2).replace(
    "http://json-schema.org/draft-07/schema#",
    "http://json-schema.org/draft-04/schema#"
  );
  const output_path = `./.schema/${type.toLowerCase()}.json`;

  return fs.promises.writeFile(output_path, schemaString);
});

Promise.all(tasks);
