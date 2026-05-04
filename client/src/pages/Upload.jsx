import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Leaderboard/context/AuthContext';
import api from '../api';

const Upload = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'Notes',
        subject: '',
        type: 'Notes',
        department: '',
        semester: '',
        externalUrl: ''
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    if (!user) {
        return <p>Please log in to upload resources.</p>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, value);
        });
        if (file) formData.append('file', file);

        try {
            await api.post('/resources', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Resource uploaded successfully.');
            navigate('/resources');
        } catch (error) {
            console.error(error);
            setMessage(error?.response?.data?.message || 'Upload failed.');
        }
    };

    return (
        <div>
            <h2>Upload a resource</h2>
            <p style={{ color: '#64748b' }}>Share notes, assignments or project documents with your college community.</p>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '700px', marginTop: '20px' }}>
                <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Title"
                    required
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description"
                    required
                    rows={5}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <input
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Subject"
                        required
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    >
                        <option>Notes</option>
                        <option>Question Paper</option>
                        <option>Assignment</option>
                        <option>Lab Report</option>
                        <option>Textbook</option>
                        <option>Presentation</option>
                        <option>Lecture Slides</option>
                        <option>Project Work</option>
                        <option>Other</option>
                    </select>
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    >
                        <option>Notes</option>
                        <option>Question Paper</option>
                        <option>Assignment</option>
                        <option>Lab Report</option>
                        <option>Textbook</option>
                        <option>Presentation</option>
                        <option>Video</option>
                        <option>Other</option>
                    </select>
                    <input
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        placeholder="Department"
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                    <input
                        value={form.semester}
                        onChange={(e) => setForm({ ...form, semester: e.target.value })}
                        placeholder="Semester"
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                </div>
                <input type="url" placeholder="External link (optional)" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button type="submit" style={{ background: '#1e3a8a', color: '#fff', padding: '12px 18px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Upload Resource</button>
                {message && <p style={{ color: '#1e3a8a' }}>{message}</p>}
            </form>
        </div>
    );
};

export default Upload;
