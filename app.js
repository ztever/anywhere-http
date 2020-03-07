const http = require("http");
const config = require("./src/config/index.js");
const path = require("path");
const route = require("./src/helper/route");
const openUrl = require("./src/helper/openUrl");
class Server {
  constructor(conf) {
    this.config = Object.assign({}, config, conf);
  }
  start() {
    const server = http.createServer(async (req, res) => {
      const filePath = path.join(this.config.root, req.url);
      route(req, res, filePath, this.config);
    });
    server.listen(this.config.port, this.config.hostName, () => {
      const url = `http://${this.config.hostName}:${this.config.port}`;
      console.log("server is listen on ", url);
      openUrl(url);
    });
  }
}

module.exports = Server;
