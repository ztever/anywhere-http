const { createGzip, createDeflate } = require("zlib");
module.exports = (rs, req, res) => {
  const acceptEncodeing = req.headers["accept-encoding"];
  if (!acceptEncodeing || !acceptEncodeing.match(/\b(gzip|deflate)\b/)) {
    return rs;
  } else if (acceptEncodeing.match(/\bgzip\b/)) {
    res.setHeader("Content-Encoding", "gzip");
    return rs.pipe(createGzip());
  } else if (acceptEncodeing.match(/\bdeflate\b/)) {
    res.setHeader("Content-Encoding", "deflate");
    return rs.pipe(createDeflate());
  }
};
