# Quest Week

App web per tracciare gli obiettivi settimanali e a lungo termine, con una sezione appunti. Funziona offline e si installa sul telefono come app (PWA).

## File

| File | Cosa contiene |
|---|---|
| `index.html` | L'app intera: pagina, stile e logica |
| `draghetto.js` | La mascotte draghetto |
| `sw.js` | Service worker: fa funzionare l'app offline |
| `manifest.json` | Nome e icone per l'installazione sul telefono |
| `icons/` | Logo dell'app in varie misure (`logo-originale.webp` è l'immagine di partenza) |

## Avviarla sul computer

Il service worker (uso offline) funziona solo da un indirizzo `http://`, non aprendo il file con doppio clic. Da questa cartella:

```
python -m http.server 8765
```

poi apri http://localhost:8765 nel browser.

## Dati

I dati sono salvati nel browser del dispositivo. Per spostarli usa **Impostazioni → Backup → Esporta / Importa**.
La sincronizzazione automatica tra computer e telefono è il prossimo passo (Supabase o Firebase, piano gratuito).
