'use strict'
const mongoose = require('mongoose');

const schema = new mongoose.Schema( {
    _id: {
        type: "ObjectId"
    },
    allocation_name: {
        type: "string"
    },
    parent_category: {
        type: "string"
    },
    parent_category_id: {
        type: "ObjectId"
    },

    _type: {
        type: "string"
    },
    created_at: {
        type: "date"
    },
    identifiers: {
        type: "object"
    },

})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model(`niche_allocations`, schema)