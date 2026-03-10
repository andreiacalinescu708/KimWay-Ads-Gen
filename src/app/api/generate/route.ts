import { NextResponse } from 'next/server'

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

export async function POST(request: Request) {
  try {
    const { productName, productDescription } = await request.json()

    if (!productName || !productDescription) {
      return NextResponse.json(
        { error: 'Missing product information' },
        { status: 400 }
      )
    }

    const apiKey = process.env.KIMI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'KIMI API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `Creează un script de reclamă video de 30 de secunde pentru:

NUME PRODUS: ${productName}
DESCRIERE: ${productDescription}

Scriptul trebuie să fie concis, persuasiv, structurat în scene cu timestamp-uri, în limba română.

Format:
SCENA 1 (0-5 sec): [descriere] + [text]
SCENA 2 (5-10 sec): [descriere] + [text]
etc.`

    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'Ești un copywriter expert în reclame video.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('KIMI API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate script from KIMI' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const script = data.choices?.[0]?.message?.content || 'No script generated'

    return NextResponse.json({ script })
  } catch (error: any) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
