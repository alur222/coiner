const axios = require('axios');
const constants = require('./constants');

export default async function(locals: any) {
  const ids = ['bitcoin', 'ethereum', 'dogecoin'];
  const api_key = process.env.API_KEY;

  try {
    const response = await axios.request({
      url: `${constants.API_BASE_URL}/simple/price`,
      method: 'GET',
      headers: {
        "x-cg-demo-api-key": api_key,
      },
      params: {
        ids: ids.join(','),
        vs_currencies: 'EUR'
      }
    })

    const history = locals.history;
    return {
      ts: (new Date()).toISOString(),
      data: response.data
    };
  } catch(ex) {
    console.error(ex);
  }
}
