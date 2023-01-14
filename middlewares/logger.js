function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`
  );
  next();
}

module.exports = logger;
