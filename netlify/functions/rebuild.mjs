// Funzione programmata: ogni giorno alle 04:00 UTC (le 6 in Italia d'estate, le 5 d'inverno)
// chiama il build hook del sito, che fa ripartire la build. La build rilegge il
// foglio Google di Lara e il calendario del Comune, quindi gli eventi si aggiornano da soli.
// L'indirizzo del build hook sta nella variabile d'ambiente BUILD_HOOK_URL (pannello Netlify).
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.error("BUILD_HOOK_URL non impostata: nessuna ricostruzione richiesta.");
    return new Response("missing BUILD_HOOK_URL", { status: 500 });
  }
  const res = await fetch(hook, { method: "POST" });
  console.log(`Ricostruzione richiesta: HTTP ${res.status}`);
  return new Response(`rebuild: ${res.status}`);
};

export const config = { schedule: "0 4 * * *" };
