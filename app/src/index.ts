import { createServer } from "./server.js";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

const app = createServer();

app.listen(PORT, () => {
    console.log(`Flutterwave MCP App → http://localhost:${PORT}`);
});
