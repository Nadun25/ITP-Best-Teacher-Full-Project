import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Book, Video, FileText, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StudentLibrary = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    topic: '',
    search: ''
  });

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry'];
  const grades = ['Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'];

  useEffect(() => {
    fetchMaterials();
  }, [filters.subject, filters.grade, filters.topic]);

    const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { subject, grade, topic } = filters;
      // Backend now handles isDeleted by default
      let url = '/api/materials?'; 
      if (subject) url += `subject=${subject}&`;
      if (grade) url += `grade=${grade}&`;
      if (topic) url += `topic=${topic}&`;
      
      console.log('Fetching materials from:', url);
      const res = await axios.get(url);
      console.log('Library Response:', res.data);
      
      if (res.data && res.data.materials) {
        setMaterials(res.data.materials);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error('Error fetching materials', err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    m.topic.toLowerCase().includes(filters.search.toLowerCase())
  );

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <div className="icon-badge pdf" title="PDF Document"><FileText size={20} /></div>;
    if (type.includes('video')) return <div className="icon-badge video" title="Video Lecture"><Video size={20} /></div>;
    if (type.includes('presentation') || type.includes('powerpoint')) return <div className="icon-badge ppt" title="PowerPoint Slides"><FileText size={20} /></div>;
    if (type.includes('word') || type.includes('msword')) return <div className="icon-badge doc" title="Word Document"><FileText size={20} /></div>;
    return <div className="icon-badge other" title="Academic Resource"><Book size={20} /></div>;
  };

  return (
    <div className="library-page animate-slide-up">
      <header className="hero-header mb-8 text-center">
        <h2 className="display-text mb-2">Academic Knowledge Hub</h2>
        <p className="text-light text-lg">Access premium learning materials curated by the best educators.</p>
      </header>

      <div className="search-container glass-card mb-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="search-box flex-1">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="What do you want to learn today?" 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <div className="filters-group flex gap-2">
            <select 
              className="custom-select"
              value={filters.subject} 
              onChange={(e) => setFilters({...filters, subject: e.target.value})}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              className="custom-select"
              value={filters.grade} 
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="">All Grades</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="premium-loader"></div>
        </div>
      ) : (
        <div className="material-grid">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material, index) => (
              <motion.div 
                key={material._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="premium-card"
              >
                <div className="card-top">
                  {getFileIcon(material.fileType)}
                  <div className="subject-tag">{material.subject}</div>
                </div>
                
                <div className="card-body">
                  <h3 className="material-title">{material.title}</h3>
                  <p className="material-desc">
                    {material.description || "No description provided for this resource."}
                  </p>
                  
                  <div className="material-meta">
                    <div className="meta-item">
                      <Filter size={14} />
                      <span>{material.grade}</span>
                    </div>
                    <span>•</span>
                    <div className="meta-item">
                      <Book size={14} />
                      <span>{material.topic}</span>
                    </div>
                  </div>
                </div>

                  <div className="card-actions">
                    <Link to={`/material/${material._id}`} className="action-btn view">
                      <Eye size={18} />
                      <span>Open Preview</span>
                    </Link>
                    <button 
                      onClick={() => {
                        const fileUrl = material.fileUrl?.startsWith('http') ? material.fileUrl : `/${material.fileUrl}`;
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = material.title || 'download';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="action-btn download"
                    >
                      <Download size={18} />
                    </button>
                  </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-state glass-card p-12 text-center w-full" style={{ gridColumn: '1/-1' }}>
              <div className="empty-icon">
                <Search size={48} color="var(--text-muted)" />
              </div>
              <h3 className="mt-4">No results found</h3>
              <p className="text-light">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .display-text {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          background: linear-gradient(135deg, #0f172a 0%, #4338ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .search-container {
          padding: 12px 24px;
        }
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border-radius: 12px;
          padding: 0 16px;
          border: 1px solid transparent;
          transition: var(--transition);
        }
        .search-box:focus-within {
          border-color: var(--primary-light);
          background: white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .search-icon {
          color: #94a3b8;
        }
        .search-box input {
          width: 100%;
          padding: 14px 12px;
          border: none;
          background: transparent;
          outline: none;
          font-size: 1rem;
          font-weight: 500;
        }
        .custom-select {
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }
        .material-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        .premium-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .premium-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          border-color: var(--primary-light);
        }
        .card-top {
          padding: 20px 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-badge.pdf { background: #fee2e2; color: #ef4444; }
        .icon-badge.video { background: #e0e7ff; color: #4338ca; }
        .icon-badge.other { background: #f5f3ff; color: #7c3aed; }
        
        .subject-tag {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 20px;
          color: #475569;
        }
        .card-body {
          padding: 20px 24px;
          flex: 1;
        }
        .material-title {
          font-size: 1.25rem;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .material-desc {
          color: var(--text-light);
          font-size: 0.95rem;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .material-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-actions {
          padding: 20px 24px;
          background: #fafafa;
          display: flex;
          gap: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .action-btn {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .action-btn.view {
          flex: 1;
          background: var(--primary);
          color: white;
        }
        .action-btn.view:hover { background: var(--primary-dark); }
        .action-btn.download {
          width: 44px;
          background: white;
          border: 1px solid #e2e8f0;
          color: #475569;
        }
        .action-btn.download:hover { background: #f1f5f9; color: var(--primary); }

        .premium-loader {
          width: 50px;
          height: 50px;
          border: 5px solid #f1f5f9;
          border-top: 5px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default StudentLibrary;
