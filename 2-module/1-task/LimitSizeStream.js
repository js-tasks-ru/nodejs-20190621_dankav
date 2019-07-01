const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    
    if (options && options.limit && !isNaN(options.limit) ){
      this.limit = options.limit;
    }

    this.streamSize = 0;

  }

  _transform(chunk, encoding, callback) {
    this.streamSize += chunk.length;

    if ( this.limit && this.streamSize > this.limit ) {
      process.nextTick(() => this.emit('error', new LimitExceededError()));
    } else {
      this.push(chunk);
      callback();
    }
  }
}

module.exports = LimitSizeStream;
