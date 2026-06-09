'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
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
import { motion, AnimatePresence } from "framer-motion";


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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reviews, searchTerm]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  return (
    <div className="space-y-4 sm:space-y-6 bg-slate-50 ">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search Reviews..."
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

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">

        {loading ? (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            <p className="text-sm text-slate-500 mt-2">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No reviews found.</p>
        ) : (
          paginatedReviews.map((review, index) => (
            <div
              key={review.id}
              className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {review.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    {review.location}
                  </p>

                </div>
                {/* RATING */}
                <div className="flex items-center justify-end gap-0.5 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* TYPE + CONTENT */}
              <div className="mt-3">
                {review.type === "video" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                    <Video size={10} /> Video
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-50 text-slate-600 text-[10px] font-bold">
                    <Type size={10} /> Text
                  </span>
                )}

                <p className="text-xs text-slate-600 italic mt-2 line-clamp-3">
                  "{review.content || "No description"}"
                </p>

                {review.video_url && (
                  <a
                    href={review.video_url}
                    target="_blank"
                    className="text-xs text-sky-600 mt-2 inline-block"
                  >
                    View Video <ExternalLink size={10} />
                  </a>
                )}
              </div>





              {/* ACTIONS */}
              <div className="flex items-center justify-between pt-2">
                {/* STATUS */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleStatus(review.id, review.is_active)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${review.is_active
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                  >
                    {review.is_active ? "Enable" : "Disable"}
                  </button>
                </div>
                <div className="flex items-center gap-2">

                  <button
                    onClick={() => openModal(review)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className=" overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase">#</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase">Customer</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase">Review Content</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase">Rating</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase">Status</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
                    <p className="mt-2 text-sm text-slate-500">Loading reviews...</p>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((review, index) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">

                    {/* INDEX */}
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                      {startIndex + index + 1}
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-4">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        {review.location}
                      </p>
                    </td>

                    {/* CONTENT */}
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        {review.type === "video" ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                            <Video size={10} /> Video
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] font-bold">
                            <Type size={10} /> Text
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 italic">
                        "{review.content ||
                          (review.type === "video"
                            ? "Video Review"
                            : "No description")}"
                      </p>

                      {review.video_url && (
                        <a
                          href={review.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-sky-600 mt-1 font-bold"
                        >
                          View Video <ExternalLink size={10} />
                        </a>
                      )}
                    </td>

                    {/* RATING */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }
                          />
                        ))}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(review.id, review.is_active)}
                        className={`px-3 py-[5px] rounded-lg text-[12px] font-medium ${review.is_active
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                      >
                        {review.is_active ? "Enable" : "Disable"}
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(review)}
                          className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
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


      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-slate-50 rounded-lg shrink-0">

        {/* Info text */}
        <span className="text-xs sm:text-sm text-slate-500 font-medium text-center sm:text-left">
          Showing{" "}
          <strong className="text-slate-700">
            {filteredReviews.length === 0 ? 0 : startIndex + 1}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-700">
            {Math.min(startIndex + itemsPerPage, filteredReviews.length)}
          </strong>{" "}
          of{" "}
          <strong className="text-slate-700">
            {filteredReviews.length}
          </strong>{" "}
          items
        </span>

        {/* Buttons */}
        <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">

          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Prev</span>
          </button>

          {/* Page indicator */}
          <div className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-[#3da9d4] bg-[#3da9d4]/10 border border-[#3da9d4]/20 rounded-lg shadow-sm">
            {currentPage} / {Math.max(1, totalPages)}
          </div>

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white p-[28px] rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingReview ? "Edit Review" : "Add Review"}
                  </h3>

                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"                            >
                  <X size={20} />
                </button>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Selection */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Review Type</label>
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
                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Customer Name</label>
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
                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Location / Role</label>
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
                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Rating (1-5)</label>
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
                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">
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


              <div className="flex gap-3 mt-6">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white p-[28px] rounded-[16px] w-full max-w-[350px] max-h-[90vh] overflow-y-auto shadow-lg text-center"
            >
              <div className="w-[60px] h-[60px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={30} />
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
                  No, Keep it
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
