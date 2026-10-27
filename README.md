# Agente Leon · Proyecto M3 (Henry)

SPA para chatear con Leon S. Kennedy usando la API de Gemini.

## Estructura
```
index.html        → estructura base (navbar, main, footer)
style.css         → estilos + modo oscuro
src/main.js       → router de la SPA (/home, /chat, /about)
src/views/        → Home.js, Chat.js, About.js
src/utils/        → api.js (fetch a /api/chat), theme.js (modo oscuro)
api/chat.js       → función serverless que llama a Gemini
vercel.json       → redirige todas las rutas a index.html
```

## Cómo desplegar en Vercel
1. Subí esta carpeta a un repo de GitHub.
2. En Vercel: **Add New → Project** e importá el repo (Framework: *Other*).
3. En **Settings → Environment Variables** agregá `GEMINI_API_KEY` con tu clave de Google AI Studio.
4. Deploy. Listo: `/home`, `/chat` y `/about` funcionan.

## Probar en local
```
npm i -g vercel
vercel dev
```

Autora: Melanie Kamann · [GitHub](https://github.com/melaniekamann203-cmyk)
