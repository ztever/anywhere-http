module.exports = (totalSize, req, res) => {
  const range = req.headers["range"];
  if (!range) {
    return {
      code: 200
    };
  }
  const size = range.match(/bytes=(\d*)-(\d*)/);
  const end = size[2];
  const start = size[1];
  if (end < start || end > totalSize || start < 0) {
    return {
      code: 200
    };
  }
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Accept-Range", `bytes ${start}-${end}/${totalSize}`);
  res.setHeader("Content-Length", end - start);
  return {
    code: 206,
    start: parseInt(start),
    end: parseInt(end)
  };
};
// curl -r 0-100  -i http://127.0.0.1:8888/.eslintrc.js
