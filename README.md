# Ejecutivos Comerciales Digitales

Demo funcional: el usuario entra desde su celular, elige un ejecutivo (Daniela o
Cristian) y conversa con él como si fuera una persona real de la empresa.

## 1. Requisitos

- Node.js 18 o superior instalado en tu computador.
- Una API Key gratuita de Google Gemini (no pide tarjeta de crédito).

### Cómo conseguir la API Key gratis de Gemini

1. Ve a **https://aistudio.google.com/apikey**
2. Inicia sesión con tu cuenta de Google.
3. Haz clic en **"Create API key"** (Crear clave de API).
4. Copia la key que te muestra (empieza distinto a las de OpenAI, es más corta).

Esta key es gratuita, sin tarjeta de crédito, y con un límite diario muy
generoso (más de 1.000 mensajes al día) — de sobra para el demo.

## 2. Probarlo en tu computador

Abre una terminal dentro de esta carpeta y ejecuta:

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` y pega tu API Key real de Gemini:

```
GEMINI_API_KEY=tu-key-de-gemini-aqui
GEMINI_MODEL=gemini-2.5-flash
```

Luego levanta el proyecto:

```bash
npm run dev
```

Ábrelo en tu navegador en `http://localhost:3000`.

## 3. Subirlo a GitHub

Como ya tienes el repositorio vacío creado, dentro de esta misma carpeta:

```bash
git init
git add .
git commit -m "Primera versión del demo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

(Reemplaza la URL por la de tu repositorio real.)

## 4. Desplegar en Vercel

1. Entra a tu cuenta de Vercel y elige "Add New Project".
2. Selecciona el repositorio que acabas de subir.
3. En "Environment Variables" agrega:
   - `GEMINI_API_KEY` → tu API Key real de Gemini
   - `GEMINI_MODEL` → `gemini-2.5-flash` (opcional, ya es el valor por defecto)
4. Presiona "Deploy".

Al terminar, Vercel te entrega una URL pública (algo como
`https://ejecutivos-digitales.vercel.app`). Esa es la que abres desde tu
celular y la que puedes convertir en código QR.

## 5. Generar el QR para la reunión

Puedes usar cualquier generador de QR gratuito (por ejemplo qr-code-generator.com)
y pegar ahí la URL que te dio Vercel.

## 6. Cómo agregar o editar ejecutivos

Todo vive en `lib/executives.js`. Cada ejecutivo tiene:

- `name`, `role`, `initial`, `accent` (color), `tagline`: lo que se ve en la interfaz.
- `systemPrompt`: la personalidad y las reglas de conversación.

Para agregar un tercer ejecutivo (por ejemplo "Valentina"), copia el bloque de
`daniela` o `cristian` dentro de `EXECUTIVES`, cambia sus datos y su
`systemPrompt`. Aparecerá automáticamente en la pantalla de selección.

## 7.5 Voz natural con IA (ElevenLabs, opcional pero recomendado)

Por defecto el chat usa la voz del navegador (gratis, pero suena algo robótica).
Puedes activar una voz mucho más natural y humana con ElevenLabs, que tiene un
plan gratis de sobra para el demo (10.000 caracteres al mes).

### Cómo activarla

1. Ve a **https://elevenlabs.io** y crea una cuenta gratis (no pide tarjeta).
2. Entra a tu perfil (ícono arriba a la derecha) → **API Keys** → copia tu key.
3. En tu archivo `.env.local`, agrega:
```
ELEVENLABS_API_KEY=tu-key-aqui
```
4. Reinicia el servidor (`Ctrl+C` y `npm run dev` de nuevo).

Con eso, el chat automáticamente usa la voz natural. Si no agregas la key, o si
falla la conexión, el sistema vuelve solo (sin que hagas nada) a la voz del
navegador — nunca se rompe la demo por esto.

### Cambiar las voces (opcional)

Cada ejecutivo tiene un `elevenVoiceId` en `lib/executives.js`. Si quieres una
voz distinta:

1. Ve a **elevenlabs.io** → **Voice Library** (biblioteca de voces).
2. Prueba voces en español y copia el **Voice ID** de la que más te guste.
3. Pégalo en `elevenVoiceId` del ejecutivo correspondiente en `lib/executives.js`.

## 7. Avatar animado + voz

El chat ahora muestra un "escenario de videollamada" arriba, con:

- Foto del ejecutivo animada (respira, brilla cuando habla)
- Fondo de oficina difuminado con siluetas cruzando (simulando gente pasando)
- Voz real leyendo cada respuesta en voz alta (usa la voz del navegador, sin costo)

Para que se vea con las fotos reales, agrega:

- `public/avatars/daniela.jpg`
- `public/avatars/cristian.jpg`
- `public/backgrounds/office.jpg`

Instrucciones detalladas de dónde conseguir fotos gratuitas de uso comercial
están en `LEEME.txt` dentro de esas mismas carpetas. Si no agregas las fotos,
la app sigue funcionando igual (usa un círculo con inicial y un fondo de color
sólido como respaldo).

La voz funciona mejor en **Chrome**. Algunos navegadores no traen voces en
español instaladas por defecto; si la voz suena en inglés o no se escucha
nada, revisa la configuración de voces de tu sistema operativo (Windows:
Configuración > Hora e idioma > Voz).

## 8. Notas importantes

- El modelo tiene instrucciones estrictas para nunca mencionar que es una IA,
  un chatbot o un sistema automático. Está diseñado para sonar como una
  persona real escribiendo desde su celular.
- Las respuestas se dividen en varios mensajes cortos y se muestran con una
  pequeña demora + "escribiendo...", para simular el ritmo de una conversación
  humana real.
- Esta primera versión no guarda conversaciones en una base de datos (se
  reinician al recargar la página). Es intencional para el demo; más adelante
  se puede sumar persistencia (Postgres) y multiempresa como plataforma SaaS.
