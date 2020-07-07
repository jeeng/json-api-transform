const { Readable } = require("stream");
const csv = require('csv-parser');

const getCsv = (string) => {
  const results = [];
  return new Promise(resolve => {
    Readable.from(string)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      });
  });
}

module.exports.formatJson = async (response, format) => {
  if (format === "csv") {
    return getCsv(response);
  } else {
    return JSON.parse(response);
  }
};