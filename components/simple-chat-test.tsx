"use client";
import { useState } from 'react';

export default function SimpleChatTest() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/simple-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                setLoading(false);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setResponse(prev => prev + parsed.content);
                  console.log('Delta:', parsed.content); // Debug log
                }
              } catch (e) {
                console.log('Parse error:', e, 'Data:', data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Simple Chat Test</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '400px', padding: '10px', marginRight: '10px' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', minHeight: '100px' }}>
        <strong>Response:</strong>
        <div>{response}</div>
      </div>
    </div>
  );
}