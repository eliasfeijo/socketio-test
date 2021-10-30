const jwt = require('jsonwebtoken');
const JWTSecret = "secret";

module.exports = {
  verifyJWT: auth = function auth(req, res, next) {
    try {
      const authorization = req.headers['authorization'];
      if(!authorization) {
        return res.status(401).json({
          message: "Missing Header 'Authorization'"
        });
      }
      const token = authorization.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: "Missing Authentication Token" });
      }
      jwt.verify(token, JWTSecret, function (err, decoded) {
        if (err) {
          return res.status(401).json({ error: "Invalid Token" });
        }
        req.userId = decoded.id;
        next();
      });
    }
    catch(error) {
      return res.status(401).json({ error: "Missing Authentication Token" });
    }
    return;
  },
}