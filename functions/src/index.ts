import * as functions from 'firebase-functions';
import requestify from 'requestify';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const darkSkyProxy = functions.region('europe-west1').https.onRequest((request, response) => {
  corsHandler(request, response, () => {

    const baseUrl: string = 'https://api.darksky.net/forecast';
    const apiKey: string | null = (functions.config().darksky && functions.config().darksky.key) || null;
    
    const latitude: number | null = (request.query && request.query.latitude) || null;
    const longitude: number | null = (request.query && request.query.longitude) || null;

    // https://regex101.com/r/ClY66P/3
    const params: string | null = (request.url && request.url.replace(/(\/\?.*longitude=.*[0-9][&]?)/g, '')) || null;
    let apiUrl: string = `${baseUrl}/${apiKey}/${latitude},${longitude}`;

    apiUrl += !!params ? `?${params}` : '';

    requestify.request(apiUrl, {
      method: request.method,
      body: request.body,
      headers: {
        'Content-Type': request.get('Content-Type'),
        Host: 'api.darksky.net',
      },
    })
    .then((proxyResponse) => {
      proxyResponse.body = request.get('Content-Type') === 'application/json' ? JSON.parse(proxyResponse.body) : proxyResponse.body;
      response.status(proxyResponse.getCode()).send(proxyResponse.body);
    })
    .fail((error) => {
      console.log('error', error);
      response.status(error.getCode()).send(error)
    });
  });
});
