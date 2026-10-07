# Quest Week

App personale per gli obiettivi settimanali e a lungo termine, con appunti e una mascotte draghetto.
Web app statica installabile come PWA: funziona offline, nessun build, nessuna dipendenza esterna.
L'utente non è uno sviluppatore: parla in italiano, spiega le modifiche in modo semplice.

## File

- `index.html` — tutta l'app: CSS in `<style>`, markup, JS in un'unica IIFE in fondo. Niente framework.
- `draghetto.js` — web component `<drago-mascotte>` fornito dall'utente (attributi `mood`, `season`, `time` — in `index.html` `season="auto" time="auto"`; metodo `celebrate()`).
  È il file dell'utente **senza modifiche nostre**: quando ne manda una nuova versione, sostituisci il file intero.
  Prima confrontala con `diff`: se è identica a quella attuale, diglielo (può aver allegato il file sbagliato).
- `sw.js` — service worker network-first con `cache: 'no-cache'` (salta la cache HTTP del browser/GitHub Pages, così gli aggiornamenti arrivano subito); offline usa la cache.
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

Altre chiavi locali: `questweek-auth` (sessione Supabase), `questweek-sync` (`since`, `pending`, `lastSync`).

I dati vecchi possono non avere i campi nuovi: usa default (`?? 'auto'`, `|| []`), non dare per scontato che esistano.
Il backup Esporta/Importa (Impostazioni) salva l'intero `state` in JSON.

## Come è organizzato il JS

- `save()` = snapshot settimana + `persist()` + `render()` (ridisegna tutto). `persist()` scrive senza ridisegnare: usalo dove un re-render distruggerebbe ciò che l'utente sta toccando (editor appunti, selettori colore durante il trascinamento).
- `render()` → `applyAppearance()`, `applyBackground()`, `renderWeek()` (chiama `updateMascot()`), `renderLong()`, `renderHistory()`. Gli appunti hanno `renderNotesList()` a parte.
- Umore draghetto (`updateMascot`): arrabbiato se da giovedì ore 12 ci sono almeno 4 missioni scadute non completate (`ANGRY_MIN_MISSED`) > triste se ieri c'erano scadenze non rispettate (`missedYesterday`, il lunedì guarda la domenica precedente) > felice. `celebrate()` quando si spunta un obiettivo o un lungo termine arriva al 100%.
- Modifica: il pulsante "Modifica" in alto mette `body.editing` (tutti i riquadri); il pulsante tondo con la matita (`.qedit`, `data-act="card-edit"`) apre solo il suo riquadro (`.card.editing`, id salvati in `editingCards` così restano aperti dopo un ridisegno). Gli elementi `.edit-only` compaiono in entrambi i casi.
- `checkTime()` ogni minuto: ridisegna solo se cambia giorno/metà settimana/settimana.
- Colori: il tema usa variabili CSS su `:root`; colore riquadri generale scritto in `<style id="cardTheme">`; colore per singola attività inline via `cardVars()`. `isDark()` sceglie testo chiaro/scuro.
- Appunti: `contenteditable` + `document.execCommand`. **Tutto l'HTML passa da `sanitize()`** (allowlist in `ALLOWED`) all'incolla e al caricamento: non inserire mai HTML degli appunti senza sanificarlo.

## Sincronizzazione (Supabase)

- Progetto `vcjncsguylsjksvclqvi`; URL e chiave **publishable** (pubblica) in `index.html` (`SB_URL`, `SB_KEY`). Mai inserire chiavi `secret`/`service_role`.
- Niente libreria: `fetch` diretto a `/auth/v1` (email + password; niente magic link perché nella PWA installata il link si aprirebbe nel browser) e `/rest/v1`.
- Schema in `supabase/schema.sql`: tabella `items (user_id, key, data, updated_at, server_at)` con RLS e funzione `push_items` che sovrascrive solo se `updated_at` è più recente.
- `flatten()` divide lo stato in pezzi (`cat:`, `goal:`, `lt:`, `note:`, `done:<settimana>:<goal>`, `snap:<settimana>`, `settings:main`); `unflatten()` li ricompone. **Se aggiungi un nuovo tipo di dato a `state`, aggiungilo anche a entrambe**, altrimenti non si sincronizza.
- `persist()` → `trackChanges()` segna i pezzi cambiati in `pending`; `syncNow()` invia i pending poi scarica le righe con `server_at` più recente. Dati arrivati dal cloud si applicano con `applyMap()` (non `persist`, per non rimandarli indietro).
- Test: non usare l'account reale; simula Supabase sovrascrivendo `window.fetch` nella pagina (vedi storia del commit della sincronizzazione).

## Regole importanti

- **Mai `alert`/`confirm`/`prompt`**: nel browser integrato e in alcune PWA restituiscono subito "Annulla". Usa `openDialog()`, `askConfirm()`, `askText()`.
- Testo utente nell'HTML sempre tramite `esc()`.
- Interfaccia e messaggi in italiano. Layout mobile-first (prova a 375px): barra schede fissa in basso, gutter 16px.
- Rispetta `prefers-reduced-motion` per le animazioni nuove.
- **Test nel browser: usa il server `obiettivi-test` (porta 8766), non la 8765.** Sulla 8765 l'utente può essere connesso
  alla sincronizzazione: dati di prova creati lì finiscono nel suo account reale e sul telefono (è già successo).
  La porta 8766 è un'origine separata, senza accesso né dati dell'utente. Se proprio devi usare la 8765, controlla prima
  `localStorage['questweek-auth']`: se c'è una sessione, non creare dati di prova e non ripristinare copie di localStorage
  (annullerebbero modifiche già sincronizzate).

## Versioni (Git)

- Repository locale, ramo `main`, autore già configurato nel progetto.
- Dopo ogni modifica verificata nel browser fai un commit e, se l'utente è d'accordo, `git push` per pubblicarla con messaggio in italiano che descriva il cambiamento dal punto di vista dell'utente.
- Se `git` non è nel PATH, usa `C:\Program Files\Git\cmd\git.exe`.
- Per annullare una modifica preferisci `git revert` (crea una nuova versione) a comandi distruttivi.

## Pubblicazione

- Online su **https://raypds.github.io/Quest-Week/** (GitHub Pages dal ramo `main`, cartella root).
- Repository pubblico: https://github.com/Raypds/Quest-Week — non mettere mai nel progetto dati personali o chiavi segrete.
- Pubblicare = `git push`: Pages si aggiorna in 1–2 minuti; il service worker network-first fa arrivare la nuova versione ai dispositivi alla prima apertura online.
- Dopo il push verifica che il sito risponda (es. `curl -s -o /dev/null -w "%{http_code}" https://raypds.github.io/Quest-Week/`).
