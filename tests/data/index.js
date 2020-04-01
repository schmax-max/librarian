const fs = require('fs')

exports.body = JSON.parse(fs.readFileSync(`./tests/data/body.json`, 'UTF-8'))
exports.scores = JSON.parse(fs.readFileSync(`./tests/data/scores.json`, 'UTF-8'))
exports.url_info = JSON.parse(fs.readFileSync(`./tests/data/url_info.json`, 'UTF-8'))
exports.word_arrays = JSON.parse(fs.readFileSync(`./tests/data/word_arrays.json`, 'UTF-8'))
