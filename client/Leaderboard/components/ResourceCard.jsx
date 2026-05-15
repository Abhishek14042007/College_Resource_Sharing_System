import { Link } from 'react-router-dom';
import api from '../../src/api';

const ResourceCard = ({ resource, onLike, onSave }) => {
    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('crssUser') ? JSON.parse(localStorage.getItem('crssUser')).token : null;
            if (!token) {
                alert('Please log in to download files');
                return;
            }

            const response = await fetch(`${api.defaults.baseURL}/resources/${resource._id}/download`, {
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

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '18px' }}>
                <h3 style={{ margin: '0 0 10px' }}>{resource.title}</h3>
                <p style={{ margin: '0 0 8px', color: '#555' }}>{resource.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ background: '#eef2ff', color: '#1e40af', padding: '6px 10px', borderRadius: '999px', fontSize: '12px' }}>{resource.type}</span>
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 10px', borderRadius: '999px', fontSize: '12px' }}>{resource.category}</span>
                </div>
                <p style={{ margin: '0 0 10px', color: '#333' }}><strong>Uploader:</strong> {resource.uploader?.name || 'Unknown'}</p>
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span>Downloads: {resource.downloads}</span>
                    <span>Likes: {resource.likes?.length || 0}</span>
                    <span>Views: {resource.views}</span>
                </div>
            </div>
            <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <Link to={`/resources/${resource._id}`} style={{ textDecoration: 'none', color: '#1e3a8a', fontWeight: '600' }}>View</Link>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {resource.storagePath && (
                        <button onClick={handleDownload} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Download</button>
                    )}
                    {onLike && (
                        <button onClick={() => onLike(resource._id)} style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' }}>Like</button>
                    )}
                    {onSave && (
                        <button onClick={() => onSave(resource._id)} style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
