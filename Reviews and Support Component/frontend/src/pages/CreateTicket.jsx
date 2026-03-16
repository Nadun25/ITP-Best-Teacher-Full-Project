import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';

const CreateTicket = () => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        recipientType: 'Teacher',
        recipientId: '' // This would usually be pre-selected if coming from a profile
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Simplification for demo

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.subject.trim()) {
            setError('Subject is required');
            return false;
        }
        if (formData.subject.trim().length < 5) {
            setError('Subject must be at least 5 characters');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (formData.description.trim().length < 20) {
            setError('Description must be at least 20 characters to help us understand the issue');
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;

        setLoading(true);

        try {
            const submitData = { ...formData };
            // For Simulation: If recipient is Teacher and no ID provided, use our seeded Prof. Smith ID
            if (submitData.recipientType === 'Teacher' && !submitData.recipientId) {
                submitData.recipientId = '640f1a2b3c4d5e6f7a8b9c02';
            }

            await ticketService.createTicket(submitData, token);
            navigate('/tickets');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Raise a Support Ticket</h1>
                    <p className="text-blue-100 text-sm opacity-90">We're here to help you solve any issues</p>
                </div>
                
                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient</label>
                        <select
                            name="recipientType"
                            value={formData.recipientType}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="Teacher">Specific Teacher</option>
                            <option value="Admin">Platform Administration</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Briefly describe the issue"
                            value={formData.subject}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Provide as much detail as possible..."
                            value={formData.description}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Response time is usually within 24-48 hours.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;
