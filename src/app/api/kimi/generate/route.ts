import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productName, productDescription, productImageUrl } = await req.json()

    if (!productName || !productDescription) {
      return NextResponse.json({ error: 'Missing product information' }, { status: 400 })
    }

    const prompt = `Creează un script de reclamă video de 30 de secunde pentru următorul produs/serviciu:

NUME PRODUS: ${productName}
DESCRIERE: ${productDescription}

Scriptul trebuie să fie:
- Concis și persuasiv
- Structurat în scene cu timestamp-uri
- Într-un ton profesional dar prietenos
- În limba română

Format de răspuns:
SCENA 1 (0-5 sec): [descriere vizuală] + [text voce off]
SCENA 2 (5-10 sec): [descriere vizuală] + [text voce off]
etc.`

    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'Ești un copywriter expert în crearea de scripturi pentru reclame video.'
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
      const error = await response.text()
      console.error('KIMI API error:', error)
      return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 })
    }

    const data = await response.json()
    const script = data.choices[0]?.message?.content || ''

    return NextResponse.json({ script })
  } catch (error) {
    console.error('KIMI generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
