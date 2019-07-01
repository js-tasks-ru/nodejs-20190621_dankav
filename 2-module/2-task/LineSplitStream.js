const stream = require('stream');
const os = require('os');
const endOfLine = os.EOL;

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    // console.log('buffer', this.buffer.toString());
    this.buffer += chunk.toString();
    const dataToSend = this.buffer.split(endOfLine);
    this.buffer = dataToSend.pop();

    // console.log('buffer2', this.buffer.toString());
    for (const line of dataToSend) {
      this.push(line);
    }

    callback();
  }

  _flush(callback) {
    // console.log('buffer', this.buffer.toString());

    if (this.buffer) this.push(this.buffer);
    callback();
  }
}

module.exports = LineSplitStream;
