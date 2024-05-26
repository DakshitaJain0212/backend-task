const Trade = require('../models/Trade');
const fs = require('fs');
const csv = require('csvtojson');
const moment = require('moment');
const path = require('path');

exports.uploadCsv = async (req, res) => {
    try {
        const filePath = path.resolve(req.file.path);
        const jsonArray = await csv().fromFile(filePath);

        const transformedArray = jsonArray.map(item => {
            const [basecoin, quotecoin] = item.Market.split('/');
            return {
                utcTime: moment.utc(item.UTC_Time, 'YYYY-MM-DD HH:mm:ss').toDate(),
                operation: item.Operation,
                market: item.Market,
                basecoin: basecoin,
                quotecoin: quotecoin,
                amount: parseFloat(item['Buy/Sell Amount']),
                price: parseFloat(item.Price)
            };
        });

        await Trade.insertMany(transformedArray);
        res.status(200).send('CSV file successfully processed');
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).send('Error processing CSV file');
    } finally {
        fs.unlink(req.file.path, err => {
            if (err) {
                console.error('Error deleting temporary file:', err);
            }
        });
    }
};

exports.getBalance = async (req, res) => {
    const { timestamp } = req.body;
    const date = moment.utc(timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();

    if (!moment(date).isValid()) {
        return res.status(400).send('Invalid timestamp format');
    }

    try {
        const trades = await Trade.find({ utcTime: { $lte: date } });
        const balances = trades.reduce((acc, trade) => {
            const { basecoin, operation, amount } = trade;
            if (!acc[basecoin]) acc[basecoin] = 0;
            acc[basecoin] += operation.toLowerCase() === 'buy' ? amount : -amount;
            return acc;
        }, {});

        res.status(200).json(balances);
    } catch (error) {
        console.error('Error calculating balance:', error);
        res.status(500).send('Error calculating balance');
    }
};