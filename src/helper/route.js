const fs = require("fs");
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
// const access = promisify(fs.access);
const path = require("path");
const handlebars = require("handlebars");
const tplPath = path.join(__dirname, "../template/dir.hbs");
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());
const mineType = require("./mime");
const compress = require("./compress");
const range = require("./range");
const isFresh = require("./cache");
module.exports = async function(req, res, filePath, config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mineType(filePath);
      res.setHeader("Content-Type", contentType);
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }
      let rs;
      // req.headers["range"] = "bytes=1-100";
      // curl -r 0-100  -i http://127.0.0.1:8888/.eslintrc.js

      const { code, start, end } = range(stats.size, req, res);
      if (code === 200) {
        rs = fs.createReadStream(filePath);
        res.statusCode = 200;
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, { start, end });
      }
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const dirData = fs.readdirSync(filePath);
      // console.log("filepath", filePath, dirData[0]);
      // fs.access(dirData[0], fs.constants.F_OK, err => {
      //   console.log("error", fs.constants.F_OK, err);
      // });
      // try {
      //   const acs = await access(dirData[1], fs.constants.R_OK);
      //   console.log("acs", dirData[1], fs.constants.R_OK, acs);
      // } catch (error) {
      //   console.log("accesserrro", error);
      // }
      const dir = path.relative(config.root, filePath);
      const data = {
        dirData,
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : ""
      };
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(template(data));
    }
  } catch (error) {
    res.statusCode = 404;
    console.log("server error", error);
    res.end(`${filePath} is not a dirctory`);
  }
};
