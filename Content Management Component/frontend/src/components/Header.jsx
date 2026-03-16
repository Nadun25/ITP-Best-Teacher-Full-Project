import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Upload, User, LogOut } from 'lucide-react';

const Header = ({ user, setUser }) => {
  const location = useLocation();

  const setRole = (role) => {
    setUser(prev => ({
      ...prev,
      role: role,
      id: role === 'teacher' ? '65f123456789012345678901' : '65f123456789012345678902'
    }));
  };

  return (
    <header className="glass shadow-sm sticky-top" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex justify-between items-center" style={{ height: '80px' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="logo-box">
            <BookOpen color="white" size={24} />
          </div>
          <span className="logo-text">Best Teacher</span>
        </Link>

        {/* Central Navigation - Role Switching */}
        <div className="role-nav glass-card p-1">
          <button 
            onClick={() => setRole('student')}
            className={`role-item ${user.role === 'student' ? 'active' : ''}`}
          >
            Student Hub
          </button>
          <button 
            onClick={() => setRole('teacher')}
            className={`role-item ${user.role === 'teacher' ? 'active' : ''}`}
          >
            Teacher Portal
          </button>
        </div>

        {/* Action Links */}
        <nav className="flex items-center gap-2">
          <Link 
            to="/library" 
            className={`nav-btn ${location.pathname === '/library' ? 'active' : ''}`}
          >
            Explore
          </Link>
          
          {user.role === 'teacher' && (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                My Assets
              </Link>
              <Link 
                to="/upload" 
                className={`btn btn-primary ml-2`}
              >
                <Upload size={18} />
                <span>Publish</span>
              </Link>
            </>
          )}

          <div className="divider mx-4"></div>

          <div className="avatar-group flex items-center gap-3">
            <div className="text-right">
              <p className="font-bold text-sm leading-none mb-1">{user.name}</p>
              <div className="flex items-center gap-1 justify-end">
                <div className={`status-dot ${user.role}`}></div>
                <span className="text-xs uppercase font-black tracking-wider text-primary">{user.role}</span>
              </div>
            </div>
            <div className="avatar">
              <User size={20} />
            </div>
          </div>
        </nav>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .logo-box {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          padding: 10px;
          border-radius: 14px;
          display: flex;
          box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);
          transition: var(--transition);
        }
        .logo-box:hover {
          transform: rotate(-5deg) scale(1.05);
        }
        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #1e293b 0%, #4338ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .role-nav {
          display: flex;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 4px;
        }
        .role-item {
          padding: 8px 24px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #64748b;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .role-item:hover:not(.active) {
          color: var(--primary);
          background: rgba(67, 56, 202, 0.05);
        }
        .role-item.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: scale(1.02);
        }
        .nav-btn {
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          color: #64748b;
          font-size: 0.95rem;
        }
        .nav-btn.active {
          color: var(--primary);
          background: #f5f3ff;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(67, 56, 202, 0.35);
        }
        .divider {
          width: 1px;
          height: 32px;
          background: #e2e8f0;
        }
        .avatar {
          width: 44px;
          height: 44px;
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: var(--shadow);
          transition: var(--transition);
        }
        .avatar:hover {
          border-color: var(--primary-light);
          transform: scale(1.05);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-dot.teacher { background-color: var(--primary); }
        .status-dot.student { background-color: var(--secondary); }
      `}} />
    </header>
  );
};

export default Header;
