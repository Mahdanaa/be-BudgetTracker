const jwt = require('jsonwebtoken');
const Config = require('../../config/config');

class JwtService {
  sign(payload) {
    return jwt.sign(payload, Config.jwt.secret, { expiresIn: '1d' });
  }

  verify(token) {
    return jwt.verify(token, Config.jwt.secret);
  }
}

module.exports = new JwtService();
