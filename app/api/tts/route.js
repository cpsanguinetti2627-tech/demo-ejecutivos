export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { text, voiceId } = await req.json();

    if (!text || !voiceId) {
      return Response.json({ error: 'Falta texto o voz.' }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      // Sin key configurada: el cliente hace fallback a la voz del navegador.
      return Response.json({ error: 'ElevenLabs no configurado.' }, { status: 501 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs error:', errText);
      return Response.json({ error: 'Error al generar la voz.' }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Error interno.' }, { status: 500 });
  }
}
