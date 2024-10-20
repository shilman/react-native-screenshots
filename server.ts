const { WebSocketServer } = require('ws');
const port = 7007;

const host = 'localhost';

const wss = new WebSocketServer({ port, host });

wss.on('connection', function connection(ws) {
  console.log('websocket connection established');

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    try {
      const json = JSON.parse(data.toString());

      wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
    } catch (error) {
      console.error(error);
    }
  });
});
