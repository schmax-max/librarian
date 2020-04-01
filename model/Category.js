'use strict'
const mongoose = require('mongoose');

const schema = new mongoose.Schema( {
    _id: {
        type: "ObjectId"
    },
    category_name: {
        type: "string",
    },
    parent_area: {
        type: "string",
    },
    parent_area_id: {
        type: "ObjectId",
    },
    allocation_names: {
        type: "array",
    }
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model(`niche_categories`, schema)