import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Video, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EditMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    topic: ''
  });
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(true);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await axios.get(`/api/materials/${id}`);
        const { title, description, subject, grade, topic, fileType, fileUrl } = res.data;
        setFormData({ title, description, subject, grade, topic });
        const fileName = fileUrl ? fileUrl.split(/[\\/]/).pop() : 'Existing File';
        setExistingFile({ type: fileType, name: fileName });
      } catch (err) {
        console.error('Error fetching material', err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

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

    try {
      // 1. Update Metadata
      await axios.put(`/api/materials/${id}`, formData);

      // 2. Update File if new one selected
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        await axios.put(`/api/materials/${id}/file`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        });
      }

      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="premium-loader"></div></div>;

  return (
    <div className="upload-container animate-slide-up py-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-light font-bold hover:text-primary">
            <ArrowLeft size={20} />
            <span>Dashboard</span>
          </Link>
          <div className="text-right">
            <h2 className="display-text-sm mb-1">Edit Resource</h2>
            <p className="text-light text-sm">Update your content and metadata.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="glass-card p-8">
            <h3 className="section-title mb-6">Update Details</h3>
            <div className="form-grid">
              <div className="form-item col-span-2">
                <label>Title</label>
                <input 
                  type="text" 
                  className={errors.title ? 'error-input' : ''}
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
                  value={formData.topic}
                  onChange={e => {
                    setFormData({...formData, topic: e.target.value});
                    if (errors.topic) setErrors({...errors, topic: null});
                  }}
                />
                {errors.topic && <span className="error-text">{errors.topic}</span>}
              </div>

              <div className="form-item col-span-2">
                <label>Description</label>
                <textarea 
                  rows="4" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="section-title mb-6">Resource Management</h3>
            <div className={`upload-zone ${errors.file ? 'error-border' : ''}`}>
              {!file ? (
                <div {...getRootProps()} className="drop-area active" style={{ cursor: 'pointer' }}>
                  <input {...getInputProps()} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="uploader-avatar" style={{ background: '#f5f3ff' }}>
                        {existingFile?.type.includes('video') ? <Video size={24} color="var(--primary)" /> : <FileText size={24} color="var(--primary)" />}
                      </div>
                      <div>
                        <p className="font-bold">Current: {existingFile?.name || 'Uploaded Content'}</p>
                        <p className="text-xs text-light uppercase font-black">Drag & drop or click to replace</p>
                      </div>
                    </div>
                    <div className="badge-outline" style={{ fontSize: '0.7rem' }}>Keep Existing</div>
                  </div>
                </div>
              ) : (
                <div className="file-preview-card">
                  <div className="preview-icon">
                    {file.type.includes('pdf') ? <FileText size={24} /> : <Video size={24} />}
                  </div>
                  <div className="file-meta">
                    <p className="file-name">{file.name} (New)</p>
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

            {status === 'uploading' && file && (
              <div className="upload-progress-box mt-8">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-sm">Uploading replacement...</span>
                  <span className="font-bold text-sm text-primary">{progress}%</span>
                </div>
                <div className="progress-track">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="status-toast success mt-8">
                <CheckCircle2 size={24} />
                <span>Changes saved successfully!</span>
              </div>
            )}

            {status === 'error' && (
              <div className="status-toast error mt-8">
                <AlertCircle size={24} />
                <span>Failed to update. Please try again.</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              type="button" 
              className="btn btn-ghost flex-1" 
              onClick={() => navigate('/dashboard')}
              disabled={uploading}
            >
              Cancel Changes
            </button>
            <button 
              type="submit" 
              className="btn-premium flex-1 justify-center"
              disabled={uploading}
            >
              {uploading ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : <><Save size={20} /> Save Variations</>}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .badge-outline {
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 8px;
          font-weight: 700;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-item { display: flex; flex-direction: column; gap: 8px; }
        .col-span-2 { grid-column: span 2; }
        .form-item label { font-weight: 700; font-size: 0.85rem; color: #475569; text-transform: uppercase; }
        .form-item input, .form-item select, .form-item textarea {
          padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; background: #f8fafc;
        }
        .form-item input:focus { border-color: var(--primary); background: white; outline: none; }
        .upload-zone { border: 2px dashed #e2e8f0; border-radius: 20px; overflow: hidden; }
        .drop-area { padding: 24px; background: #fff; }
        .file-preview-card { padding: 24px; display: flex; align-items: center; gap: 16px; background: #f0f9ff; }
        .status-toast { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 16px; font-weight: 700; }
        .status-toast.success { background: #f0fdf4; color: #166534; }
        .status-toast.error { background: #fef2f2; color: #991b1b; }
        
        .error-input { border-color: #ef4444 !important; background: #fef2f2 !important; }
        .error-text { color: #ef4444; font-size: 0.75rem; font-weight: 700; margin-top: 4px; display: block; }
        .error-border { border-color: #ef4444 !important; }
      `}} />
    </div>
  );
};

export default EditMaterial;
