'use strict'
const mongoose = require('mongoose');

const schema = new mongoose.Schema( {
  _type: {
        type: "string"
    },
    _id: {
        type: "ObjectId"
    },
    created_at: {
        type: "date",
        format: "date-time"
    },
    structure: {
        type: "object"
    },
})

schema.set('toJSON', { virtuals: true });

module.exports = {
    urls: mongoose.model(`structure_urls`, schema),
    geographies: mongoose.model(`structure_geographies`, schema),
    niches: mongoose.model(`structure_niches`, schema),
    trendings: mongoose.model(`structure_trendings`, schema),
};
