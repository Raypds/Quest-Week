# Quest Week

App personale per gli obiettivi settimanali e a lungo termine, con appunti e una mascotte draghetto.
Web app statica installabile come PWA: funziona offline, nessun build, nessuna dipendenza esterna.
L'utente non è uno sviluppatore: parla in italiano, spiega le modifiche in modo semplice.

## File

- `index.html` — tutta l'app: CSS in `<style>`, markup, JS in un'unica IIFE in fondo. Niente framework.
- `draghetto.js` — web component `<drago-mascotte>` fornito dall'utente (attributi `mood`, `season`; metodo `celebrate()`). Trattalo come asset esterno: se l'utente ne manda una nuova versione, sostituisci il file intero.
- `sw.js` — service worker network-first: online carica sempre la versione nuova, offline usa la cache.
  **Ogni file nuovo che l'app carica va aggiunto ad `ASSETS`**, e incrementa `CACHE` quando cambi l'elenco.
- `manifest.json`, `icons/` — nome "Quest Week" e icone PWA (generate da `icons/logo-originale.webp`; le `maskable` hanno gli angoli riempiti di verde).
- `LEGGIMI.md` — guida per l'utente.

## Avvio

`.claude/launch.json` → server `obiettivi` (`python -m http.server 8765`), poi http://localhost:8765.
Il service worker non funziona aprendo il file con doppio clic.

## Dati

Tutto in `localStorage` alla chiave `obiettivi-settimanali-v1` — **non rinominarla** (l'utente perderebbe i dati).
Struttura (vedi `defaultState()`):

- `categories[]` `{ id, name, color, cardBg? }`
- `goals[]` `{ id, categoryId, title, due? }` — obiettivi settimanali ricorrenti; `due` = giorno 1 (lun)…7 (dom) o null
- `weeks{ "2026-W41": { done: { goalId: categoryId }, snapshot: [{ id, name, color, total }] } }` — chiave settimana ISO; lo snapshot tiene lo storico corretto anche se gli obiettivi cambiano
- `longTerm[]` `{ id, title, unit, current, total, color, cardBg? }`
- `notes[]` `{ id, title, html, createdAt, updatedAt }` — HTML già sanificato
- `settings` `{ bg, card, theme: 'auto'|'light'|'dark', season: 'auto'|'autumn'|'winter'|'spring'|'summer'|'' }`

I dati vecchi possono non avere i campi nuovi: usa default (`?? 'auto'`, `|| []`), non dare per scontato che esistano.
Il backup Esporta/Importa (Impostazioni) salva l'intero `state` in JSON.

## Come è organizzato il JS

- `save()` = snapshot settimana + `persist()` + `render()` (ridisegna tutto). `persist()` scrive senza ridisegnare: usalo dove un re-render distruggerebbe ciò che l'utente sta toccando (editor appunti, selettori colore durante il trascinamento).
- `render()` → `applyAppearance()`, `applyBackground()`, `renderWeek()` (chiama `updateMascot()`), `renderLong()`, `renderHistory()`. Gli appunti hanno `renderNotesList()` a parte.
- Umore draghetto (`updateMascot`): arrabbiato se una scadenza è mancata > felice da 70% > triste sotto 40% dopo metà settimana > felice. `celebrate()` quando si spunta un obiettivo o un lungo termine arriva al 100%.
- `checkTime()` ogni minuto: ridisegna solo se cambia giorno/metà settimana/settimana.
- Colori: il tema usa variabili CSS su `:root`; colore riquadri generale scritto in `<style id="cardTheme">`; colore per singola attività inline via `cardVars()`. `isDark()` sceglie testo chiaro/scuro.
- Appunti: `contenteditable` + `document.execCommand`. **Tutto l'HTML passa da `sanitize()`** (allowlist in `ALLOWED`) all'incolla e al caricamento: non inserire mai HTML degli appunti senza sanificarlo.

## Regole importanti

- **Mai `alert`/`confirm`/`prompt`**: nel browser integrato e in alcune PWA restituiscono subito "Annulla". Usa `openDialog()`, `askConfirm()`, `askText()`.
- Testo utente nell'HTML sempre tramite `esc()`.
- Interfaccia e messaggi in italiano. Layout mobile-first (prova a 375px): barra schede fissa in basso, gutter 16px.
- Rispetta `prefers-reduced-motion` per le animazioni nuove.
- Prima di testare nel browser salva una copia dei dati dell'utente e ripristinala dopo:
  `sessionStorage.setItem('backup-test', localStorage.getItem('obiettivi-settimanali-v1'))` → test → ripristino.

## Versioni (Git)

- Repository locale, ramo `main`, autore già configurato nel progetto.
- Dopo ogni modifica verificata nel browser fai un commit con messaggio in italiano che descriva il cambiamento dal punto di vista dell'utente.
- Se `git` non è nel PATH, usa `C:\Program Files\Git\cmd\git.exe`.
- Per annullare una modifica preferisci `git revert` (crea una nuova versione) a comandi distruttivi.

## Prossimi passi previsti

- Sincronizzazione tra dispositivi con lo stesso account (Supabase o Firebase, piano gratuito; "ultima modifica vince").
- Pubblicazione online (GitHub Pages o Netlify) per installarla sul telefono.
