import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'student', contactNumber: '', profilePicture: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginContext, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/profile');
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, contactNumber: value });
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.contactNumber || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.contactNumber.length !== 10) {
      setError('Contact number must be exactly 10 digits');
      return;
    }

    if (formData.profilePicture && !formData.profilePicture.match(/^https?:\/\/.+/i)) {
      setError('Please enter a valid URL for the profile picture (starting with http:// or https://)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        loginContext(data, data.token);
        navigate('/profile');
      } else {
        setError(data.message || data.errors?.[0]?.msg || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-card">
      <h2 className="card-title">Create Account</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" name="name" className="form-input" 
            value={formData.name} onChange={handleChange} placeholder="John Doe" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" name="email" className="form-input" 
            value={formData.email} onChange={handleChange} placeholder="john@example.com" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Contact Number</label>
          <input 
            type="text" name="contactNumber" className="form-input" 
            value={formData.contactNumber} onChange={handleContactChange} placeholder="1234567890" 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Profile Picture URL (Optional)</label>
          <input 
            type="text" name="profilePicture" className="form-input" 
            value={formData.profilePicture} onChange={handleChange} placeholder="https://example.com/photo.jpg" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" name="password" className="form-input" 
            value={formData.password} onChange={handleChange} placeholder="Min 6 characters" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">I am a...</label>
          <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
