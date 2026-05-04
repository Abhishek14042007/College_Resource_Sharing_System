import { useContext, useEffect, useState } from 'react';
import ResourceCard from '../../Leaderboard/components/ResourceCard';
import { AuthContext } from '../../Leaderboard/context/AuthContext';
import api from '../api';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchSaved = async () => {
            setLoading(true);
            try {
                const response = await api.get('/users/saved/resources');
                setSaved(response.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, [user]);

    if (!user) {
        return <p>Please log in to see your profile.</p>;
    }

    return (
        <div>
            <section style={{ display: 'grid', gap: '18px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ margin: '0 0 8px' }}>{user.name}</h2>
                    <p style={{ margin: 0, color: '#475569' }}>{user.email}</p>
                    <p style={{ margin: '12px 0 0', color: '#64748b' }}>{user.college}</p>
                    <p style={{ margin: '4px 0 0', color: '#64748b' }}>{user.department || 'Department not set'} • {user.year || 'Year not set'}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                        <strong>Reputation</strong>
                        <p style={{ margin: '8px 0 0', fontSize: '24px' }}>{user.reputation || 0}</p>
                    </div>
                    <div style={{ padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                        <strong>Uploads</strong>
                        <p style={{ margin: '8px 0 0', fontSize: '24px' }}>{user.uploadCount || 0}</p>
                    </div>
                    <div style={{ padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                        <strong>Badges</strong>
                        <p style={{ margin: '8px 0 0', color: '#334155' }}>{(user.badges || []).join(', ') || 'None'}</p>
                    </div>
                </div>
            </section>

            <section>
                <h3>Saved resources</h3>
                {loading ? (
                    <p>Loading saved items…</p>
                ) : saved.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                        {saved.map((resource) => (
                            <ResourceCard key={resource._id} resource={resource} />
                        ))}
                    </div>
                ) : (
                    <p>You have no saved resources yet.</p>
                )}
            </section>
        </div>
    );
};

export default Profile;
