import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../Leaderboard/context/AuthContext';
import api from '../api';

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await api.get(`/resources/${id}`);
                setResource(response.data);
            } catch (error) {
                console.error('Error fetching resource:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('crssUser') ? JSON.parse(localStorage.getItem('crssUser')).token : null;
            if (!token) {
                alert('Please log in to download files');
                return;
            }

            const response = await fetch(`${api.defaults.baseURL}/resources/${id}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', resource.title || 'download');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };

    const handleLike = async () => {
        try {
            const response = await api.put(`/resources/${id}/like`);
            setLiked(response.data.liked);
            setResource({ ...resource, likes: { length: response.data.likes } });
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleSave = async () => {
        try {
            const response = await api.put(`/resources/${id}/save`);
            setSaved(response.data.saved);
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this resource? This cannot be undone.')) return;

        try {
            await api.delete(`/resources/${id}`);
            navigate('/resources');
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete resource');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await api.post(`/resources/${id}/comments`, { text: comment });
            const response = await api.get(`/resources/${id}`);
            setResource(response.data);
            setComment('');
        } catch (error) {
            console.error('Comment error:', error);
        }
    };

    if (loading) return <p>Loading resource…</p>;
    if (!resource) return <p>Resource not found</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => navigate('/resources')} style={{ marginBottom: '20px', background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>

            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h1 style={{ margin: '0 0 15px' }}>{resource.title}</h1>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <span style={{ background: '#eef2ff', color: '#1e40af', padding: '8px 12px', borderRadius: '999px', fontSize: '14px' }}>{resource.type}</span>
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '8px 12px', borderRadius: '999px', fontSize: '14px' }}>{resource.category}</span>
                    {resource.subject && <span style={{ background: '#fef3c7', color: '#92400e', padding: '8px 12px', borderRadius: '999px', fontSize: '14px' }}>{resource.subject}</span>}
                </div>

                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginBottom: '20px' }}>{resource.description}</p>

                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <p style={{ margin: '8px 0' }}><strong>Uploaded by:</strong> {resource.uploader?.name}</p>
                    {resource.college && <p style={{ margin: '8px 0' }}><strong>College:</strong> {resource.college}</p>}
                    {resource.department && <p style={{ margin: '8px 0' }}><strong>Department:</strong> {resource.department}</p>}
                    {resource.semester && <p style={{ margin: '8px 0' }}><strong>Semester:</strong> {resource.semester}</p>}
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '15px' }}>
                    <span>📥 Downloads: <strong>{resource.downloads}</strong></span>
                    <span>👍 Likes: <strong>{resource.likes?.length || 0}</strong></span>
                    <span>👀 Views: <strong>{resource.views}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {resource.storagePath && (
                        <button onClick={handleDownload} style={{ background: '#059669', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>⬇️ Download</button>
                    )}
                    {resource.externalUrl && (
                        <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#3b82f6', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>🔗 Open Link</a>
                    )}
                    <button onClick={handleLike} style={{ background: liked ? '#ec4899' : '#cbd5e1', color: liked ? '#fff' : '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>👍 {liked ? 'Unlike' : 'Like'}</button>
                    <button onClick={handleSave} style={{ background: saved ? '#f59e0b' : '#cbd5e1', color: saved ? '#fff' : '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>⭐ {saved ? 'Unsave' : 'Save'}</button>
                    {user && resource.uploader && user._id === resource.uploader._id && (
                        <button onClick={handleDelete} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>🗑️ Delete</button>
                    )}
                </div>

                {resource.tags && resource.tags.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <strong>Tags:</strong> {resource.tags.map((tag, i) => (
                            <span key={i} style={{ background: '#e5e7eb', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginRight: '8px', marginTop: '8px' }}>{tag}</span>
                        ))}
                    </div>
                )}

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '20px' }}>
                    <h3>Comments ({resource.comments?.length || 0})</h3>

                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px' }}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment…"
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'inherit', minHeight: '80px' }}
                        />
                        <button type="submit" style={{ marginTop: '10px', background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}>Post Comment</button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {resource.comments?.map((c, i) => (
                            <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                <strong>{c.user?.name || 'Anonymous'}</strong>
                                <p style={{ margin: '8px 0 0', color: '#555' }}>{c.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetail;
