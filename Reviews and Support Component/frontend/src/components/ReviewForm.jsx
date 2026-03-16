import React, { useState } from 'react';
import reviewService from '../services/reviewService';
import StarRating from './StarRating';

const ReviewForm = ({ teacherId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Frontend Validation
        if (rating === 0) {
            setError('Please select a star rating');
            return;
        }
        if (comment.trim().length < 10) {
            setError('Comment must be at least 10 characters long');
            return;
        }
        if (comment.trim().length > 500) {
            setError('Comment is too long (max 500 characters)');
            return;
        }

        setLoading(true);
        try {
            await reviewService.createReview({
                teacherId,
                lessonId: 'lesson-' + Math.random().toString(36).substring(7),
                rating,
                comment: comment.trim()
            }, token);
            
            setSuccess(true);
            setRating(0);
            setComment('');
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review. You might have already reviewed this lesson.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'student') return null;

    return (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Leave a Review</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 animate-pulse">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100">
                        Thank you! Your review has been submitted successfully.
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-3xl transition-all transform hover:scale-110 ${
                                    star <= rating ? 'text-yellow-400' : 'text-gray-200'
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Your Feedback</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What was your experience like with this teacher?"
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                    ></textarea>
                    <div className="flex justify-between mt-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${comment.length < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                            {comment.length} / 500 characters
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Post Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
