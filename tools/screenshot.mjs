// Screenshot a pagina intera con Chrome headless, via protocollo DevTools (nessuna dipendenza).
//   node tools/screenshot.mjs <url> <out.jpg> [larghezza] [altezza] [mobile]
// Prima dello scatto accende tutti gli elementi ".reveal", altrimenti quelli sotto la piega restano invisibili.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [url, out, w = "1440", h = "900", mobile = "0", clipY = "", clipH = "", scrollY = ""] = process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9000 + Math.floor(Math.random() * 900);
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/claude-chrome-${port}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let targets;
for (let i = 0; i < 40; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {}
  await sleep(250);
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else if (d.method) events.push(d.method); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === "1" });
await send("Page.navigate", { url });
for (let i = 0; i < 80 && !events.includes("Page.loadEventFired"); i++) await sleep(100);
await sleep(400);
await send("Runtime.evaluate", { expression: `document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); document.querySelector('.nav')?.classList.remove('scrolled');` });
if (scrollY !== "") { await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${+scrollY})` }); await sleep(1500); }
await sleep(900);
const shot = { format: "jpeg", quality: 72, captureBeyondViewport: true };
if (clipY !== "") shot.clip = { x: 0, y: +clipY, width: +w, height: +clipH, scale: 1 };
const { result } = await send("Page.captureScreenshot", shot);
writeFileSync(out, Buffer.from(result.data, "base64"));
console.log(`scritto ${out}`);
ws.close(); chrome.kill();
