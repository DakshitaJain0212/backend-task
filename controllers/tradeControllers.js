const Trade = require('../models/Trade');
const fs = require('fs');
const csv = require('csvtojson');
const multer = require('multer');
const moment = require('moment');


exports.uploadCsv = async(req,res) => {
    try {
    const jsonArray = await csv().fromFile(req.file.path);
            const transformedArray = jsonArray.map(item => {
                const [basecoin, quotecoin] = item.Market.split('/');
                return {
                    utcTime: new Date(item.UTC_Time),
                    operation: item.Operation,
                    market: item.Market,
                    basecoin: basecoin,
                    quotecoin: quotecoin,
                    amount: parseFloat(item['Buy/Sell Amount']),
                    price: parseFloat(item.Price)
                };
            });

            console.log(transformedArray);
            await Trade.insertMany(transformedArray);
            res.status(200).send('CSV file successfully processed');
        } catch (error) {
            console.error('Error processing CSV file:', error);
            res.status(500).send('Error processing CSV file');
        } finally {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting temporary file:', err);
                }
            });
        }
}


exports.getBalance = async(req,res) => {
    const { timestamp } = req.body;
    console.log(timestamp);
    const date = moment.utc(timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
    console.log(date);

    if (!date || !moment(date).isValid()) {
        return res.status(400).send('Invalid timestamp format');
    }

    try {
        const trades = await Trade.find({ utcTime: { $lte: date } });
        const balances = trades.reduce((acc, trade) => {
            const { basecoin, operation, amount } = trade;
            if (!acc[basecoin]) acc[basecoin] = 0;
            if(operation === 'Buy'){
                acc[basecoin] +=   amount
            }
            else  acc[basecoin] -=  amount;
             

            return acc;
        }, {});

        res.status(200).json(balances);
    } catch (error) {
        res.status(500).send('Error calculating balance');
    }

}
