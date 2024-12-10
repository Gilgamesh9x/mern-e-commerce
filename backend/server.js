import http from "http";
import app from "./app.js";
import mongoConnect from "./services/mongo.js";

const port = 8000;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

startServer();
