import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../api/AuthContext';

export default function Bids() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);

  const load = () => client.get('/bids/').then((res) => setBids(res.data.results || res.data));
  useEffect(load, []);

  const respond = async (id, newStatus) => {
    await client.post(`/bids/${id}/respond/`, { status: newStatus });
    load();
  };

  return (
    <div className="container">
      <h1>{user?.role === 'investor' ? 'Your Bids' : 'Bids on Your Businesses'}</h1>
      {bids.map((bid) => (
        <div className="card" key={bid.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>{bid.business_name}</h3>
            <span className={`badge ${bid.status === 'accepted' ? 'verified' : bid.status === 'rejected' ? 'rejected' : 'pending'}`}>
              {bid.status}
            </span>
          </div>
          <p><strong>Amount:</strong> ${bid.amount}</p>
          {bid.message && <p className="muted">"{bid.message}"</p>}
          <p className="muted">By {bid.investor?.username}</p>
          {user?.role === 'entrepreneur' && bid.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="primary" onClick={() => respond(bid.id, 'accepted')}>Accept</button>
              <button onClick={() => respond(bid.id, 'rejected')}>Reject</button>
            </div>
          )}
        </div>
      ))}
      {bids.length === 0 && <p className="muted">No bids yet.</p>}
    </div>
  );
}
