import { useEffect, useState } from 'react';
import ResourceCard from '../../Leaderboard/components/ResourceCard';
import api from '../api';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchResources = async (query = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/resources?${query}`);
            setResources(response.data.resources || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = search ? `search=${encodeURIComponent(search)}` : '';
        fetchResources(query);
    };

    return (
        <div>
            <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Browse resources</h2>
                    <p style={{ margin: '8px 0 0', color: '#64748b' }}>Search by title, subject, category or college.</p>
                </div>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search resources"
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                    <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer' }}>Search</button>
                </form>
            </div>

            {loading ? (
                <p>Loading resources…</p>
            ) : resources.length ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                    {resources.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} />
                    ))}
                </div>
            ) : (
                <p>No resources match your search. Try a different keyword.</p>
            )}
        </div>
    );
};

export default Resources;
