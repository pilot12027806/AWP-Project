const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const wss = new WebSocket.Server({ port: 8080 });




/****
 * 
 * 
 * 
 * 
 * 
 * 
 * this is homework attempt to implement in project
 * this FILE WAS SCRAPED
 * 
 * 
 * 
 */
let chatHistory = [];

wss.on('connection', (ws) => {
  console.log('A new client connected');

  ws.send(JSON.stringify({ type: 'history', data: chatHistory }));

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    if (parsedMessage.type === 'message') {
      chatHistory.push(parsedMessage.data);
    }
  });
  saveChatHistory();

  ws.on('close', () => {
    console.log('A client disconnected');
  });
});


const saveChatHistory = () => {
    fs.writeFileSync(
      path.join(__dirname, 'data/chat.json'),
      JSON.stringify(chatHistory, null, 2),
      'utf-8'
    );
  };

  
console.log('WebSocket server running on ws://localhost:8080');
