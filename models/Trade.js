const mongoose  = require('mongoose');
const { Schema } = mongoose;

const tradeSchema = new Schema({
    utcTime: {type: Date, required: true },
    operation: {type: String, required: true},
    market: {type: String, required: true},
    basecoin: {type: String, required: true},
    quotecoin: {type: String, required: true},
    amount: {type: Number, required: true},
    price : {type: Number, required: true},
})

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;