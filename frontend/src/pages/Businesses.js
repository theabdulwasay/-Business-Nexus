import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../api/AuthContext';

export default function Businesses() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', description: '', tags: '', funding_needed: 0 });

  const load = () => {
    client.get('/businesses/', { params: search ? { search } : {} })
      .then((res) => setBusinesses(res.data.results || res.data));
  };

  useEffect(load, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await client.post('/businesses/', form);
    setForm({ name: '', industry: '', description: '', tags: '', funding_needed: 0 });
    setShowForm(false);
    load();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Businesses</h1>
        {user?.role === 'entrepreneur' && (
          <button className="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ List a Business'}
          </button>
        )}
      </div>

      <input
        placeholder="Search by name or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 20 }}
      />

      {showForm && (
        <div className="card">
          <h3>New Business Listing</h3>
          <form onSubmit={handleCreate}>
            <input placeholder="Business name" value={form.name}
                   onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Industry" value={form.industry}
                   onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            <textarea placeholder="Description" value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Tags (comma separated)" value={form.tags}
                   onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            <input type="number" placeholder="Funding needed" value={form.funding_needed}
                   onChange={(e) => setForm({ ...form, funding_needed: e.target.value })} />
            <button className="primary" type="submit">Submit for Verification</button>
          </form>
        </div>
      )}

      <div className="grid">
        {businesses.map((b) => (
          <Link key={b.id} to={`/businesses/${b.id}`} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{b.name}</h3>
              <span className={`badge ${b.status}`}>{b.status}</span>
            </div>
            <p className="muted">{b.industry}</p>
            <p>{b.description?.slice(0, 100)}{b.description?.length > 100 ? '...' : ''}</p>
            <div className="tag-list">
              {b.tags && b.tags.split(',').map((t) => t.trim() && <span key={t}>{t.trim()}</span>)}
            </div>
          </Link>
        ))}
        {businesses.length === 0 && <p className="muted">No businesses found.</p>}
      </div>
    </div>
  );
}
