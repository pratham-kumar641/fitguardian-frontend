import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [age, setAge] = useState(user?.age || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [bmiHistory, setBmiHistory] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setBmiHistory(res.data.bmiHistory || []);
                if (res.data.age) setAge(res.data.age);
                if (res.data.gender) setGender(res.data.gender);
                if (res.data.phone) setPhone(res.data.phone);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const dataToUpdate = { name, age, gender, phone };
            if (password) dataToUpdate.password = password;
            const res = await api.put('/auth/profile', dataToUpdate);
            setUser({ ...user, ...res.data });
            setMessage('Profile updated successfully');
            setPassword('');
        } catch (error) {
            setMessage('Failed to update profile');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-textMain">My Profile</h1>
            
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-electricCyan mb-4">Edit Profile</h2>
                {message && <p className="mb-4 text-neonGreen text-sm p-2 bg-neonGreen/10 rounded">{message}</p>}
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Full Name</label>
                        <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-textMuted mb-1">Age</label>
                            <input type="number" className="input-field" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm text-textMuted mb-1">Gender</label>
                            <select className="input-field" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Phone Number</label>
                        <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-textMuted mb-1">New Password (leave blank to keep current)</label>
                        <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="neon-button">Update Profile</button>
                </form>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-electricCyan mb-4">Recent BMI History</h2>
                {bmiHistory.length === 0 ? (
                    <p className="text-textMuted text-sm">No BMI data saved yet.</p>
                ) : (
                    <div className="space-y-3">
                        {bmiHistory.map((entry, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                                <div>
                                    <span className="font-bold text-textMain text-lg mr-3">{entry.value}</span>
                                    <span className="text-sm text-textMuted">{entry.category}</span>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
