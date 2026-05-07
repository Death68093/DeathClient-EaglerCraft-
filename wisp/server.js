import http from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js";

const port = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    // Basic health check for Render/UptimeRobot
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Wisp Server is Running');
});

server.on("upgrade", (req, socket, head) => {
    // This handles the Wisp protocol handshake
    wisp.routeRequest(req, socket, head);
});

server.listen(port, () => {
    console.log(`Wisp server listening on port ${port}`);
});
