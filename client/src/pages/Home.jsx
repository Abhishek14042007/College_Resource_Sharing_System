import { useEffect, useState } from 'react';
import ResourceCard from '../../Leaderboard/components/ResourceCard';
import api from '../api';

const Home = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get('/resources?limit=8&sort=newest');
                setResources(response.data.resources || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <section style={{ marginBottom: '40px', display: 'grid', gap: '24px' }}>
                <div style={{ padding: '40px', borderRadius: '24px', background: '#eef2ff' }}>
                    <h1 style={{ margin: 0, fontSize: '2.6rem' }}>College resource sharing made easy</h1>
                    <p style={{ maxWidth: '720px', margin: '16px 0 0', color: '#334155' }}>
                        Discover notes, assignments, question papers, labs and projects shared by students across your college.
                        Upload your own helpful material and build reputation as a trusted contributor.
                    </p>
                </div>
            </section>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>Latest resources</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Browse the newest uploads from students and faculty.</p>
                    </div>
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
                    <p>No resources available yet. Upload one to get started.</p>
                )}
            </section>
        </div>
    );
};

export default Home;
