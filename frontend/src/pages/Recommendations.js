import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Recommendations() {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    client.get('/recommendations/').then((res) => setRecs(res.data.results || res.data));
  }, []);

  return (
    <div className="container">
      <h1>Recommended for You</h1>
      <p className="muted">Based on the interests set in your investor profile.</p>
      <div className="grid">
        {recs.map((r) => (
          <Link key={r.id} to={`/businesses/${r.business.id}`} className="card">
            <h3>{r.business.name}</h3>
            <p className="muted">{r.business.industry}</p>
            <p>{r.business.description?.slice(0, 100)}</p>
            <p className="muted">Match score: {r.score.toFixed(2)}</p>
          </Link>
        ))}
        {recs.length === 0 && (
          <p className="muted">No matches yet — add interests in your profile to get recommendations.</p>
        )}
      </div>
    </div>
  );
}
