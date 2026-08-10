import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../api/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [investorProfile, setInvestorProfile] = useState(null);
  const [interests, setInterests] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.role === 'investor') {
      client.get('/investor-profile/').then((res) => {
        setInvestorProfile(res.data);
        setInterests(res.data.interests || '');
      });
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    await client.patch('/investor-profile/', { interests });
    setSaved(true);
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="card">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Bio:</strong> {user?.bio || '—'}</p>
      </div>

      {user?.role === 'investor' && investorProfile && (
        <div className="card">
          <h3>Investment Interests</h3>
          <p className="muted">Comma-separated tags used to match you with businesses.</p>
          <form onSubmit={save}>
            <input value={interests} onChange={(e) => setInterests(e.target.value)}
                   placeholder="e.g. fintech, agritech, iot" />
            <button className="primary" type="submit">Save</button>
          </form>
          {saved && <p className="muted">Saved!</p>}
        </div>
      )}
    </div>
  );
}
