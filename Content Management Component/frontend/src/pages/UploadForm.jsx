import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Video, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UploadForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    topic: ''
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.grade) newErrors.grade = 'Please select a grade';
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (!file) newErrors.file = 'Please select a file to upload';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      const rej = fileRejections[0];
      let msg = 'Invalid file';
      if (rej.errors[0].code === 'file-too-large') msg = 'File is too large (max 100MB)';
      if (rej.errors[0].code === 'file-invalid-type') msg = 'Invalid file type';
      setErrors(prev => ({ ...prev, file: msg }));
    } else {
      setFile(acceptedFiles[0]);
      setErrors(prev => ({ ...prev, file: null }));
    }
    setStatus('idle');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'video/mp4': ['.mp4']
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    setStatus('uploading');

    const data = new FormData();
    data.append('file', file);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axios.post('/api/materials/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setUploading(false);
    }
  };

  return (
    <div className="upload-container animate-slide-up py-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h2 className="display-text-sm mb-2">Publish Knowledge</h2>
          <p className="text-light">Share your expertise with the next generation of scholars.</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="glass-card p-8">
            <h3 className="section-title mb-6">Material Details</h3>
            <div className="form-grid">
              <div className="form-item col-span-2">
                <label>Title</label>
                <input 
                  type="text" 
                  className={errors.title ? 'error-input' : ''}
                  placeholder="e.g. Advanced Calculus - Week 4"
                  value={formData.title}
                  onChange={e => {
                    setFormData({...formData, title: e.target.value});
                    if (errors.title) setErrors({...errors, title: null});
                  }}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-item">
                <label>Subject</label>
                <select 
                  className={errors.subject ? 'error-input' : ''}
                  value={formData.subject} 
                  onChange={e => {
                    setFormData({...formData, subject: e.target.value});
                    if (errors.subject) setErrors({...errors, subject: null});
                  }}
                >
                  <option value="">Choose Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>

              <div className="form-item">
                <label>Target Grade</label>
                <select 
                  className={errors.grade ? 'error-input' : ''}
                  value={formData.grade} 
                  onChange={e => {
                    setFormData({...formData, grade: e.target.value});
                    if (errors.grade) setErrors({...errors, grade: null});
                  }}
                >
                  <option value="">Choose Grade</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="Grade 13">Grade 13</option>
                </select>
                {errors.grade && <span className="error-text">{errors.grade}</span>}
              </div>

              <div className="form-item col-span-2">
                <label>Topic</label>
                <input 
                  type="text" 
                  className={errors.topic ? 'error-input' : ''}
                  placeholder="e.g. Integrals and Derivatives"
                  value={formData.topic}
                  onChange={e => {
                    setFormData({...formData, topic: e.target.value});
                    if (errors.topic) setErrors({...errors, topic: null});
                  }}
                />
                {errors.topic && <span className="error-text">{errors.topic}</span>}
              </div>

              <div className="form-item col-span-2">
                <label>Description (Optional)</label>
                <textarea 
                  rows="4" 
                  placeholder="Provide a brief overview of what this material covers..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="section-title mb-6">Resource Selection</h3>
            <div className={`upload-zone ${errors.file ? 'error-border' : ''}`}>
              {!file ? (
                <div {...getRootProps()} className={`drop-area ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="upload-icon-box">
                    <Upload size={32} />
                  </div>
                  <p className="main-text">Click to browse or drag & drop</p>
                  <p className="sub-text">Supports PDF, DOC, PPT or MP4 (Max 100MB)</p>
                </div>
              ) : (
                <div className="file-preview-card">
                  <div className="preview-icon">
                    {file.type.includes('pdf') ? <FileText size={24} /> : <Video size={24} />}
                  </div>
                  <div className="file-meta">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  {!uploading && (
                    <button type="button" onClick={() => setFile(null)} className="btn-close">
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>
            {errors.file && <p className="error-text mt-2 text-center">{errors.file}</p>}

            {status === 'uploading' && (
              <div className="upload-progress-box mt-8">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-sm">Publishing to cloud...</span>
                  <span className="font-bold text-sm text-primary">{progress}%</span>
                </div>
                <div className="progress-track">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="status-toast success mt-8">
                <CheckCircle2 size={24} />
                <span>Your material is now live! Redirecting...</span>
              </div>
            )}

            {status === 'error' && (
              <div className="status-toast error mt-8">
                <AlertCircle size={24} />
                <span>Publishing failed. Please check your connection.</span>
              </div>
            )}
          </div>

          <div className="actions-footer flex gap-4">
            <button 
              type="button" 
              className="btn btn-ghost flex-1" 
              onClick={() => navigate('/dashboard')}
              disabled={uploading}
            >
              Save Draft
            </button>
            <button 
              type="submit" 
              className="btn-premium flex-1 justify-center"
              disabled={uploading || !file}
            >
              {uploading ? <><Loader2 className="animate-spin" size={20} /> Publishing...</> : 'Publish Live'}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-item { display: flex; flex-direction: column; gap: 8px; }
        .col-span-2 { grid-column: span 2; }
        
        .form-item label {
          font-weight: 700;
          font-size: 0.85rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .form-item input, 
        .form-item select, 
        .form-item textarea {
          padding: 14px 18px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          font-size: 1rem;
          background: #f8fafc;
          transition: var(--transition);
        }
        
        .form-item input:focus, 
        .form-item select:focus, 
        .form-item textarea:focus {
          outline: none;
          background: white;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 4px rgba(67, 56, 202, 0.08);
        }
        
        .upload-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          transition: var(--transition);
        }
        
        .drop-area {
          padding: 48px;
          text-align: center;
          cursor: pointer;
          background: #fcfdfe;
        }
        
        .drop-area.active {
          background: #f5f3ff;
          border-color: var(--primary-light);
        }
        
        .upload-icon-box {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: var(--shadow);
          color: var(--primary);
        }
        
        .main-text { font-weight: 800; color: #1e293b; margin-bottom: 4px; }
        .sub-text { font-size: 0.85rem; color: #64748b; font-weight: 500; }
        
        .file-preview-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
        }
        
        .preview-icon {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        
        .file-meta { flex: 1; }
        .file-name { font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .file-size { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
        
        .btn-close {
          padding: 8px;
          border-radius: 10px;
          color: var(--text-muted);
        }
        .btn-close:hover { background: #fee2e2; color: #ef4444; }
        
        .progress-track {
          height: 10px;
          background: #f1f5f9;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .status-toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-radius: 16px;
          font-weight: 700;
        }
        .status-toast.success { background: #f0fdf4; color: #166534; }
        .status-toast.error { background: #fef2f2; color: #991b1b; }
        
        .btn-ghost {
          background: #f1f5f9;
          color: #475569;
          font-weight: 700;
          border-radius: 16px;
          padding: 14px;
        }
        .btn-ghost:hover { background: #e2e8f0; }

        .error-input { border-color: #ef4444 !important; background: #fef2f2 !important; }
        .error-text { color: #ef4444; font-size: 0.75rem; font-weight: 700; margin-top: 4px; display: block; }
        .error-border { border-color: #ef4444 !important; }
      `}} />
    </div>
  );
};

export default UploadForm;
