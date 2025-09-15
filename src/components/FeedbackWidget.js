'use client';

import { useState } from 'react';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');

  const submit = async () => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, path: window.location.pathname })
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      setTimeout(() => { setOpen(false); setRating(0); setComment(''); setStatus('idle'); }, 1500);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700"
        >
          Feedback
        </button>
      )}
      {open && (
        <div className="w-80 bg-white rounded-xl shadow-2xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">How was your experience?</div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="flex space-x-1 mb-3">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell us what's working or not..."
            className="w-full border rounded-md p-2 text-sm mb-3"
            rows={3}
          />
          <button
            onClick={submit}
            disabled={status==='submitting'}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            {status==='submitting' ? 'Sending...' : status==='success' ? 'Thanks!' : status==='error' ? 'Try Again' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}


