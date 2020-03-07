const yargs = require("yargs");
// process.argv 获取执行命令的参数   node -p 8888 app.js  类似的库还有commander
const Server = require("./app");
const argv = yargs
  .usage("anywhere [options]")
  .option("p", {
    alias: "port",
    describe: "端口号",
    default: 8888
  })
  .option("h", {
    alias: "hostname",
    describe: "host",
    default: "127.0.0.1"
  })
  .option("d", {
    alias: "root",
    describe: "root",
    default: process.cwd()
  })
  .version()
  .alias("v", "version")
  .help().argv;
  

const server = new Server(argv);
server.start();
