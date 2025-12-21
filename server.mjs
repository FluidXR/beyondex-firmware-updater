import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8000);
const HOST = "127.0.0.1"; // localhost => secure context in Chromium for WebUSB

const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
]);

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);
    const reqPath = url.pathname === "/" ? "/index.html" : url.pathname;

    // Prevent directory traversal
    const safePath = path.normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, "");
    const filePath = path.join(__dirname, safePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME.get(ext) || "application/octet-stream";

    const data = await readFile(filePath);

    // Helpful WebUSB-related header (also set on Vercel via vercel.json)
    send(res, 200, data, {
      "Content-Type": contentType,
      "Permissions-Policy": "usb=(self)",
    });
  } catch (e) {
    send(res, 404, "Not found\n", { "Content-Type": "text/plain; charset=utf-8" });
  }
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`WebUSB updater: http://localhost:${PORT}`);
});


