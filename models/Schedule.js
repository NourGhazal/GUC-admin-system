const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    day: { type: String, required: true },
    slot: [{ type: Schema.Types.ObjectId, ref: 'slot', required: true }]

})

module.exports = mongoose.model('Schedule', scheduleSchema);