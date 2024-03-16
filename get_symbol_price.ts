export default function(locals: any, symbol: string, minutes=60) {
  const history = locals.history;

  if (!history.length) {
    return {
      latest: 0,
      average: 0,
      history: [],
      count: 0,
    };
  }

  const filtered = history.filter((x: any) => x.data[symbol]);
  const get_slices = (arr, n = 1) => n === 0 ? [] : arr.slice(-n);
  const slices = get_slices(filtered, minutes);
  const count = slices.length;
  const latest_price_in_eur = slices[count - 1].data[symbol]["eur"];
  const latest = `EUR ${latest_price_in_eur}`;
  const average = (slices.reduce((a: number, c: any) => a + c.data[symbol]["eur"], 0) / count)

  return {
    latest,
    average,
    history: slices.map((x: any) => {
      return {
        date: x.ts,
        price: x.data[symbol]["eur"],
        currency: "EUR",
      };
    }),
    count,
  }
};
