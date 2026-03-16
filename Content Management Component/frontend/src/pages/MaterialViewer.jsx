import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, ArrowLeft, FileText, User } from 'lucide-react';

const MaterialViewer = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await axios.get(`/api/materials/${id}`);
        setMaterial(res.data);
      } catch (err) {
        console.error('Error fetching material', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  if (loading) return <div className="flex justify-center p-20"><div className="premium-loader"></div></div>;
  if (!material) return <div className="p-20 text-center">Material not found.</div>;

  const isVideo = material.fileType.includes('video');
  const isPDF = material.fileType.includes('pdf');
  const fileUrl = material.fileUrl?.startsWith('http') ? material.fileUrl : `/${material.fileUrl}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = material.title || 'resource';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileBadge = (type) => {
    if (type.includes('pdf')) return 'PDF Document';
    if (type.includes('video')) return 'MP4 Video';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'PPT Slides';
    if (type.includes('word') || type.includes('msword')) return 'Word Doc';
    return 'Learning Material';
  };

  return (
    <div className="viewer-container animate-slide-up py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/library" className="flex items-center gap-2 text-light font-bold hover:text-primary transition-all">
            <ArrowLeft size={18} />
            <span>Academic Library</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-tighter text-muted">Viewing Platform</span>
            <div className="h-1 w-8 bg-primary rounded-full"></div>
          </div>
        </div>
        
        <div className="viewer-grid">
          {/* Main Content Area */}
          <div className="viewer-main">
            <div className="glass-card viewer-card overflow-hidden shadow-2xl">
              <div className="viewer-stage">
                {isVideo ? (
                  <video controls className="w-full h-full block" src={fileUrl}>
                    Your browser does not support the video tag.
                  </video>
                ) : isPDF ? (
                  <iframe 
                    src={`${fileUrl}#toolbar=0`} 
                    className="w-full h-full border-none" 
                    title="Document Preview"
                  />
                ) : (
                  <div className="file-placeholder">
                    <div className="placeholder-icon">
                      <FileText size={80} />
                    </div>
                    <h2 className="mb-2">{getFileBadge(material.fileType)}</h2>
                    <p className="text-light max-w-xs mx-auto mb-8">
                      This file format is optimized for offline study. Download to access the full content.
                    </p>
                    <button onClick={handleDownload} className="btn-premium py-4 px-10">
                      <Download size={20} />
                      <span>Download ({(material.fileSize / (1024 * 1024)).toFixed(2)} MB)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge-primary">{material.subject}</span>
                <span className="text-muted font-bold">•</span>
                <span className="text-muted font-bold text-sm">{material.grade} Edition</span>
              </div>
              <h1 className="display-text-sm mb-4" style={{ fontSize: '2.8rem' }}>{material.title}</h1>
              <div className="glass-card p-6 mt-6">
                <h4 className="section-title mb-4">Educational Overview</h4>
                <p className="description-text">{material.description || "No detailed overview provided for this specialized resource."}</p>
              </div>
            </div>
          </div>

          {/* Interaction Sidebar */}
          <aside className="viewer-sidebar flex flex-col gap-6">
            <div className="glass-card p-6 border-accent">
              <h3 className="section-title mb-4">Curated By</h3>
              <div className="flex items-center gap-4">
                <div className="uploader-avatar shadow-inner">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{material.uploadedBy?.name || 'Verified Faculty'}</p>
                  <p className="text-xs text-primary font-black uppercase tracking-tighter">Academic Professor</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="section-title mb-5">Deep Information</h3>
              <div className="info-list">
                <div className="info-row">
                  <span className="label">Lesson Category</span>
                  <span className="value tag bg-slate-100">{material.topic}</span>
                </div>
                <div className="info-row">
                  <span className="label">Access Status</span>
                  <span className="value text-success">Public Domain</span>
                </div>
                <div className="info-row">
                  <span className="label">Last Modified</span>
                  <span className="value">{new Date(material.lastModified || material.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Format</span>
                  <span className="value">{material.fileType.split('/')[1].toUpperCase()}</span>
                </div>
              </div>
            </div>

            <button onClick={handleDownload} className="btn-premium w-full flex-center gap-3 py-5 text-lg shadow-xl" style={{ borderRadius: '20px' }}>
              <Download size={22} />
              <span>Full Resource Download</span>
            </button>
            
            <p className="text-center text-xs text-muted font-bold px-4">
              By downloading, you agree to use this material for personal educational purposes only.
            </p>
          </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .viewer-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
        }
        .viewer-stage {
          background: #0f172a;
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .file-placeholder {
          text-align: center;
          color: white;
          padding: 3rem;
        }
        .placeholder-icon {
          width: 140px;
          height: 140px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--primary-light);
        }
        .description-text {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.8;
          white-space: pre-wrap;
        }
        .uploader-avatar {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .info-list { display: flex; flex-direction: column; gap: 16px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; }
        .info-row .label { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .info-row .value { font-weight: 700; color: #1e293b; }
        .info-row .value.tag { background: #f1f5f9; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; }
      `}} />
    </div>
  );
};

export default MaterialViewer;
