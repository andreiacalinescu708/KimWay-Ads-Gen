'use client'

import { useState } from 'react'

export default function Home() {
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateScript = async () => {
    if (!productName || !productDescription) {
      setError('Completează toate câmpurile')
      return
    }

    setLoading(true)
    setError('')
    setScript('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, productDescription }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Eroare la generare')
      }

      setScript(data.script)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🎬 Kimiway Ads Generator</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Generează reclame video pentru produsele tale
      </p>

      <div style={{ background: 'white', padding: 30, borderRadius: 8, marginTop: 30, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Numele Produsului *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ex: Cremă hidratantă organică"
            style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Descriere Produs *
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Descrie produsul în detaliu..."
            rows={4}
            style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 16, resize: 'vertical' }}
          />
        </div>

        {error && (
          <div style={{ background: '#fee', color: '#c33', padding: 12, borderRadius: 4, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <button
          onClick={generateScript}
          disabled={loading}
          style={{
            width: '100%',
            padding: 16,
            background: loading ? '#999' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 18,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Se generează...' : '✨ Generează Script'}
        </button>
      </div>

      {script && (
        <div style={{ background: 'white', padding: 30, borderRadius: 8, marginTop: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>📝 Script Generat</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 20, borderRadius: 4, overflow: 'auto' }}>
            {script}
          </pre>
          <button
            onClick={() => alert('Video generation - coming next!')}
            style={{
              width: '100%',
              padding: 16,
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 20,
            }}
          >
            🎥 Generează Video
          </button>
        </div>
      )}
    </div>
  )
}
