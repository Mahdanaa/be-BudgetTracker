const HttpError = require('./HttpError');

class ForBiddenError extends HttpError {
  constructor(message) {
    super(message, 403);
    this.name = 'ForBiddenError';
  }
}

module.exports = HttpError;
