## API Endpoints

### 1. Upload CSV File

- *Endpoint*: POST /api/trades/upload
- *Form-data*: CsvFile (select CSV file to upload)

### 2. Get Balance

- *Endpoint*: POST /api/trades/getbalance
- *JSON Body*:
  json
  {
    "timestamp": "YYYY-MM-DD HH:mm:ss"
  }
  

## Example CSV File Format


UTC_Time,Operation,Market,Buy/Sell Amount,Price
2022-09-28 12:00:00,BUY,BTC/USD,1.5,45000
2022-09-28 12:05:00,SELL,BTC/USD,0.5,46000


## Testing the APIs

Use Postman or a similar tool to test the APIs:

1. *Upload CSV File*: POST /api/trades/upload
2. *Get Balance*: POST /api/trades/getbalance