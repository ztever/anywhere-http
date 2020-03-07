const { catchConfig } = require("../config");
function refreshCache(stats, res) {
  const { maxAge, expires, lastModified, cacheControl, etag } = catchConfig;
  if (expires) {
    res.setHeader("expires", new Date(Date.now() + +maxAge * 1000));
  }
  if (cacheControl) {
    res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
  }
  if (lastModified) {
    res.setHeader("Last-Modified", stats.mtime.toUTCString());
  }
  if (etag) {
    res.setHeader("Etag", `${stats.size}-${stats.mtime}`);
  }
}

module.exports = (stats, req, res) => {
  refreshCache(stats, res);
  const lastModified = req.headers["if-modified-since"];
  const etag = req.headers["if-none-match"];

  if (
    lastModified &&
    etag &&
    (lastModified === res.getHeader("Last-Modified") ||
      etag === res.getHeader("Etag"))
  ) {
    return true;
  }
  return false;
};
