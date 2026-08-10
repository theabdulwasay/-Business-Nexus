import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../api/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    client.get('/businesses/').then((res) => setBusinesses(res.data.results || res.data));
    client.get('/bids/').then((res) => setBids(res.data.results || res.data));
  }, []);

  const myBusinesses = businesses.filter((b) => user && b.owner && b.owner.id === user.id);

  return (
    <div className="container">
      <h1>Welcome, {user?.username}</h1>
      <p className="muted">Role: {user?.role}</p>

      <div className="grid" style={{ marginTop: 20 }}>
        <div className="card">
          <h3>Businesses on platform</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{businesses.length}</p>
          <Link to="/businesses">Browse all &rarr;</Link>
        </div>
        <div className="card">
          <h3>Your active bids</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{bids.length}</p>
          <Link to="/bids">View bids &rarr;</Link>
        </div>
        {user?.role === 'entrepreneur' && (
          <div className="card">
            <h3>Your businesses</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{myBusinesses.length}</p>
            <Link to="/businesses">Manage &rarr;</Link>
          </div>
        )}
        {user?.role === 'investor' && (
          <div className="card">
            <h3>Recommendations</h3>
            <p className="muted">Tailored to your interests</p>
            <Link to="/recommendations">See matches &rarr;</Link>
          </div>
        )}
      </div>
    </div>
  );
}
