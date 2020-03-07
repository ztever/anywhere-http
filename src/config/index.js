module.exports = {
  hostName: "127.0.0.1",
  port: 8888,
  root: process.cwd(),
  compress: /\.(html|css|js|hbs)/,
  catchConfig: {
    maxAge: 600, //秒,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};
