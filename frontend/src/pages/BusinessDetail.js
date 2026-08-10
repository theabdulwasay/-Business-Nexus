import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../api/AuthContext';

export default function BusinessDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    client.get(`/businesses/${id}/`).then((res) => setBusiness(res.data));
  }, [id]);

  const submitBid = async (e) => {
    e.preventDefault();
    await client.post('/bids/', { business: id, amount, message });
    setStatus('Bid submitted!');
    setAmount('');
    setMessage('');
  };

  if (!business) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>{business.name}</h1>
          <span className={`badge ${business.status}`}>{business.status}</span>
        </div>
        <p className="muted">{business.industry}</p>
        <p>{business.description}</p>
        <p><strong>Funding needed:</strong> ${business.funding_needed}</p>
        <div className="tag-list">
          {business.tags && business.tags.split(',').map((t) => t.trim() && <span key={t}>{t.trim()}</span>)}
        </div>
        <p className="muted" style={{ marginTop: 12 }}>Owner: {business.owner?.username}</p>
      </div>

      {user?.role === 'investor' && (
        <div className="card">
          <h3>Place an Investment Bid</h3>
          <form onSubmit={submitBid}>
            <input type="number" placeholder="Bid amount ($)" value={amount}
                   onChange={(e) => setAmount(e.target.value)} required />
            <textarea placeholder="Message to entrepreneur (optional)" value={message}
                      onChange={(e) => setMessage(e.target.value)} />
            <button className="primary" type="submit">Submit Bid</button>
          </form>
          {status && <p className="muted">{status}</p>}
        </div>
      )}
    </div>
  );
}
