import { LoroDoc } from 'loro-crdt';
import { WebSocketServer, type WebSocket } from 'ws';

const PORT = Number(process.env.PORT || 3001);
const doc = new LoroDoc();
doc.setPeerId(0n);

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on port ${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  console.log(`Client connected (total: ${wss.clients.size})`);

  const snapshot = doc.export({ mode: 'snapshot' });
  ws.send(snapshot);

  ws.on('message', (data: Buffer) => {
    const update = new Uint8Array(data);
    try {
      doc.import(update);
    } catch (e) {
      console.error('  Failed to import update:', e);
      return;
    }

    for (const client of wss.clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(update);
      }
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected (total: ${wss.clients.size})`);
  });
});
