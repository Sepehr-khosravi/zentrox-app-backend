const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const config = require("config");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: false,
    })
);

app.use(helmet());

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

const router = require("./src/routes");
app.use("/api", router);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false,
    },
    transports: ["websocket"],
});

require("./core/socket")(io);

// Local development: npm run dev
if (require.main === module) {
    const PORT = process.env.PORT ||
        (config.has("PORT") ? config.get("PORT") : 3000);

    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Hosting platforms can import the HTTP server.
module.exports = server;