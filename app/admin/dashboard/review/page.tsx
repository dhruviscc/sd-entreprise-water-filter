'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    AlertTriangle,
    X,
    Save,
    Star,
    Video,
    Type,
    ExternalLink,
    CheckCircle2,
    XCircle,

} from 'lucide-react';
import { toast } from 'sonner';

interface Review {
    id: string;
    name: string;
    location: string;
    rating: number;
    content: string;
    type: 'text' | 'video';
    video_url: string;

    is_active: boolean;
    display_order: number;
    created_at: string;
}

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        rating: 5,
        content: '',
        type: 'text' as 'text' | 'video',
        video_url: '',

        is_active: true,
        display_order: 0
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/admin/api/review');
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to fetch reviews');
            }
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (review: Review | null = null) => {
        if (review) {
            setEditingReview(review);
            setFormData({
                name: review.name,
                location: review.location || '',
                rating: review.rating,
                content: review.content || '',
                type: review.type,
                video_url: review.video_url || '',

                is_active: review.is_active,
                display_order: review.display_order
            });
        } else {
            setEditingReview(null);
            setFormData({
                name: '',
                location: '',
                rating: 5,
                content: '',
                type: 'text',
                video_url: '',

                is_active: true,
                display_order: reviews.length
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (formData.type === 'text' && !formData.name) {
            toast.error("Customer name is required");
            return;
        }

        if (formData.type === 'video' && !formData.video_url) {
            toast.error("Video URL is required for video reviews");
            return;
        }

        setIsSaving(true);
        try {
            const method = editingReview ? 'PUT' : 'POST';
            const url = editingReview ? `/admin/api/review?id=${editingReview.id}` : '/admin/api/review';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    name: formData.type === 'video' && !formData.name ? 'Video Testimonial' : formData.name
                })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to save review');
            }

            toast.success(`Review ${editingReview ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchReviews();
        } catch (err: any) {
            toast.error(err?.message || "Failed to save review");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/admin/api/review?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');
            setReviews(reviews.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
            toast.success(`Review ${!currentStatus ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const deleteReview = (id: string) => {
        setReviewToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/admin/api/review?id=${reviewToDelete}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete review');
            setReviews(reviews.filter(r => r.id !== reviewToDelete));
            toast.success('Review deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Error deleting review');
        } finally {
            setIsDeleting(false);
            setReviewToDelete(null);
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            className="w-full py-2.5 pr-[40px] pl-[16px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">

                    <button
                        onClick={() => openModal(null)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={18} /> <span>Add Review</span>
                    </button>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">



                <table className="w-full border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr >
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">#</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Customer</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Review Content</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Rating</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Status</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody >
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
                                    <p className="mt-2 text-sm text-slate-500">Loading reviews...</p>
                                </td>
                            </tr>
                        ) : filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No reviews found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredReviews.map((review, index) => (
                                <tr key={review.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center text-slate-400 font-mono text-xs">
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">

                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{review.name}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{review.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-md">
                                            <div className="flex items-center gap-2 mb-1">
                                                {review.type === 'video' ? (
                                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                        <Video size={10} /> Video
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                                                        <Type size={10} /> Text
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 line-clamp-2 italic">
                                                "{review.content || (review.type === 'video' ? 'Video Review' : 'No description')}"
                                            </p>
                                            {review.video_url && (
                                                <a href={review.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-sky-600 hover:underline mt-1 font-bold">
                                                    View Video <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <button
                                            onClick={() => toggleStatus(review.id, review.is_active)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${review.is_active
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            title={review.is_active ? "Disable Review" : "Enable Review"}
                                        >
                                            {review.is_active ? "Disable" : "Enable"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openModal(review)}
                                                className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                                                title="Edit Review"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteReview(review.id)}
                                                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Delete Review"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>

            {/* Review Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {editingReview ? "Edit Review" : "Add New Review"}
                                </h3>
                                <p className="text-sm text-slate-500">Share what your customers are saying</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Type Selection */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review Type</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'text' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${formData.type === 'text'
                                                ? 'border-sky-600 bg-sky-50 text-sky-600 shadow-sm'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            <Type size={18} />
                                            <span className="font-bold text-sm">Text Review</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'video' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${formData.type === 'video'
                                                ? 'border-sky-600 bg-sky-50 text-sky-600 shadow-sm'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            <Video size={18} />
                                            <span className="font-bold text-sm">Video Review</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Customer Name */}
                                {formData.type === 'text' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 bg-white"
                                            placeholder="e.g. Rahul Sharma"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Location/Role */}
                                {formData.type === 'text' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Role</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 bg-white"
                                            placeholder="e.g. Ahmedabad, Resident"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Rating */}
                                {formData.type === 'text' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating (1-5)</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className={`p-2 rounded-lg transition-all ${formData.rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                                >
                                                    <Star size={24} fill={formData.rating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Review Text Content (Only for text type) */}
                                {formData.type === 'text' && (
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Review Content
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 bg-white min-h-[100px] resize-none"
                                            placeholder="Write the customer's feedback here..."
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Video URL (Only for video type) */}
                                {formData.type === 'video' && (
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video URL (Direct link to .mp4 or YouTube)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 bg-white"
                                            placeholder="https://example.com/video.mp4"
                                            value={formData.video_url}
                                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 flex gap-3 shrink-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]"                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none disabled:opacity-60"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {editingReview ? "Update Review" : "Save Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Review?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to remove this review? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]"                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
