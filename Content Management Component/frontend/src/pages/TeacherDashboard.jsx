import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, FileText, Video, ExternalLink, AlertCircle, Book, Eye, Download, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const TeacherDashboard = ({ user }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchMyMaterials();
  }, [user.id]);

  const fetchMyMaterials = async () => {
    setLoading(true);
    try {
      // Assuming teacher ID is handled by backend session/token
      const res = await axios.get(`/api/materials?teacher=${user.id}`); 
      setMaterials(res.data.materials);
    } catch (err) {
      console.error('Error fetching materials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/materials/${id}`);
      setMaterials(materials.filter(m => m._id !== id));
      setShowConfirm(null);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const stats = [
    { label: 'Total Assets', value: materials.length, icon: <Book size={24} />, color: 'var(--primary)' },
    { label: 'Total Outreach', value: '2.4k', icon: <Eye size={24} />, color: 'var(--accent)' },
    { label: 'Storage Allotted', value: '1.2 GB', icon: <Download size={24} />, color: 'var(--secondary)' },
  ];

  return (
    <div className="dashboard-container animate-slide-up">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="display-text-sm">Creator Studio</h2>
          <p className="text-light">Manage and analyze your published learning resources.</p>
        </div>
        <Link to="/upload" className="btn-premium">
          <Upload size={20} />
          <span>Publish New</span>
        </Link>
      </header>

      <div className="stats-row mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + '15', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="content-section">
        <h3 className="section-title mb-6">Published Materials</h3>
        
        {loading ? (
          <div className="flex justify-center p-12"><div className="premium-loader"></div></div>
        ) : materials.length > 0 ? (
          <div className="management-grid">
            {materials.map((m, i) => (
              <motion.div 
                key={m._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="manage-card glass-card"
              >
                <div className="manage-card-top">
                  <span className="type-pill">{m.fileType.split('/')[1].toUpperCase()}</span>
                  <div className="actions-menu">
                    <Link to={`/material/${m._id}`} className="icon-btn view" title="Preview"><Eye size={18} /></Link>
                    <Link to={`/edit/${m._id}`} className="icon-btn edit" title="Edit Metadata"><Edit size={18} /></Link>
                    <button className="icon-btn delete" onClick={() => setShowConfirm(m._id)} title="Unpublish"><X size={18} /></button>
                  </div>
                </div>
                
                <h4 className="title-text">{m.title}</h4>
                <div className="meta-info">
                  <span className="subject">{m.subject}</span>
                  <span className="dot">•</span>
                  <span>{m.grade}</span>
                </div>

                <div className="manage-card-bottom">
                  <div className="date-box">
                    <p className="label">Published On</p>
                    <p className="value">{new Date(m.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/material/${m._id}`} className="view-link">
                    Analytics &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state glass-card p-12 text-center">
            <div className="empty-blob">
              <Upload size={48} color="var(--primary)" />
            </div>
            <h3 className="mt-4">Your studio is empty</h3>
            <p className="text-light mb-6">Start your journey by uploading your first study guide or video lecture.</p>
            <Link to="/upload" className="btn btn-primary">Start Uploading</Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="modal-card glass-card p-8"
            >
              <h3>Move to Trash?</h3>
              <p className="text-light mt-2 mb-6">This will unpublish the material. You can restore it later from your archives.</p>
              <div className="flex gap-4">
                <button className="btn flex-1" onClick={() => setShowConfirm(null)}>Keep it</button>
                <button className="btn btn-error flex-1" onClick={() => handleDelete(showConfirm)}>Confirm Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .display-text-sm {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -1px;
          color: #0f172a;
        }
        .btn-premium {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          color: white;
          padding: 14px 28px;
          border-radius: 16px;
          font-weight: 700;
          box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
        }
        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(15, 23, 42, 0.4);
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          border-left: 4px solid var(--primary);
          padding-left: 12px;
        }
        .management-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .manage-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          border: 1px solid transparent;
          transition: var(--transition);
        }
        .manage-card:hover {
          border-color: rgba(67, 56, 202, 0.2);
          transform: translateY(-5px);
        }
        .manage-card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .type-pill {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          color: #475569;
        }
        .actions-menu { display: flex; gap: 8px; }
        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          color: #64748b;
        }
        .icon-btn:hover { transform: scale(1.1); }
        .icon-btn.delete:hover { background: #fee2e2; color: #ef4444; }
        .icon-btn.edit:hover { background: #e0e7ff; color: #4338ca; }
        
        .title-text {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #0f172a;
        }
        .meta-info {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-light);
          margin-bottom: 24px;
        }
        .subject { color: var(--primary); }
        .dot { margin: 0 8px; }
        
        .manage-card-bottom {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .date-box .label { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .date-box .value { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
        .view-link {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--primary);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card {
          width: 100%;
          max-width: 400px;
        }
        .btn-error {
          background: #ef4444;
          color: white;
          font-weight: 700;
        }
        .btn-error:hover { background: #dc2626; }
        .btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: var(--transition);
        }
        .premium-loader {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default TeacherDashboard;
