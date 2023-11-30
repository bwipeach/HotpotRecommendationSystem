const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Hotpot = new Schema(
    {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        price: { type: Number, default: 0 },
        image: { type: String, default: '' },
        slug: { type: String, slug: 'name', unique: true }
    },
    {
        timestamps: true
    }
);

//add plugin
mongoose.plugin(slug);
Hotpot.index({ name: 'text' });
Hotpot.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Hotpot', Hotpot);
