import express from 'express';
import cron from 'node-cron';
import get_prices from './get_prices';
import get_symbol_price from './get_symbol_price';

interface Currency {
  eur: number
}

interface Prices {
  bitcoin: Currency
  dogecoin: Currency
  ethereum: Currency
}

interface History {
  ts: string,
  data: Prices
}

interface PricesResponse {
  results: History[]
}

interface SymbolPriceResponse {
  latest: any,
  average: number,
  history: any[],
  count: number,
}

interface JSONResponse<T> {
  json: (data: T) => void;
};
interface Handler<T> {
  (request: express.Request, response: JSONResponse<T>): void;
}

const app = express();
app.locals.history = []

const handlePrices: Handler<PricesResponse> = (
  request: express.Request,
  response: JSONResponse<PricesResponse>
) => {
  const history = request.app.locals.history;
  response.json({
    results: history,
  });
}
app.get('/prices', handlePrices);

const handleSymbolPrice: Handler<SymbolPriceResponse> = (
  request: express.Request,
  response: JSONResponse<SymbolPriceResponse | { error: string }>
) => {
  const history = request.app.locals.history;
  const { minutes } = request.query;
  const { symbol } = request.params;
  if (['bitcoin', 'ethereum', 'dogecoin'].includes(request.params.symbol)) {
    response.json(get_symbol_price(app.locals, symbol, minutes ? +minutes : undefined));
  } else {
    response.json({
      error: 'Unknown symbol'
    })
  }
}
app.get('/price/:symbol', handleSymbolPrice)

cron.schedule("*/60 * * * * *", async function () {
  console.log("cron task setup to run every 60 seconds");
  app.locals.history.push(await get_prices(app.locals))
});

app.listen(process.env.PORT, 
   () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });