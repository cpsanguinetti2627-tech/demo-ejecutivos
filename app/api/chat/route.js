import { getExecutive } from '@/lib/executives';

export const runtime = 'nodejs';

// Convierte el historial estilo OpenAI (role: user/assistant) al formato
// que espera la API de Gemini (role: user/model).
function toGeminiContents(messages) {
  return (Array.isArray(messages) ? messages : []).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

export async function POST(req) {
  try {
    const { executiveId, messages } = await req.json();

    const executive = getExecutive(executiveId);
    if (!executive) {
      return Response.json({ error: 'Ejecutivo no válido' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'Falta configurar GEMINI_API_KEY en las variables de entorno.' },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: executive.systemPrompt }],
        },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 400,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini error:', errText);
      return Response.json({ error: 'Error al conectar con el servicio.' }, { status: 502 });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() || '';

    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Error interno.' }, { status: 500 });
  }
}
