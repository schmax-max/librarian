'use strict'
const mongoose = require('mongoose');

const schema = new mongoose.Schema( {
    _id: {
        type: "ObjectId"
    },
    created_at: {
        type: "date",
        format: "date-time"
    },
    area_name: {
        type: "object"
    },
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model(`niche_areas`, schema)
