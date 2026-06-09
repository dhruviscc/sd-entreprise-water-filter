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
  ChevronLeft,
  ChevronRight,
  Save,

} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";


interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  display_order: number;
  created_at: string;
}

const CATEGORIES = ["General", "Products", "Services", "AMC", "Technical Questions"];

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    status: 'published',
    display_order: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/admin/api/faq');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch FAQs');
      }
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (faq: FAQ | null = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        status: faq.status,
        display_order: faq.display_order
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        status: 'published',
        display_order: faqs.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast.error("Question and Answer are required");
      return;
    }

    setIsSaving(true);
    try {
      const method = editingFaq ? 'PUT' : 'POST';
      const url = editingFaq ? `/admin/api/faq?id=${editingFaq.id}` : '/admin/api/faq';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to save FAQ');
      }

      toast.success(`FAQ ${editingFaq ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save FAQ");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/admin/api/faq?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setFaqs(faqs.map(f => f.id === id ? { ...f, status: newStatus } : f));
      toast.success(`FAQ marked as ${newStatus}`);
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const deleteFaq = (id: string) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/admin/api/faq?id=${faqToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      setFaqs(faqs.filter(f => f.id !== faqToDelete));
      toast.success('FAQ deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Error deleting FAQ');
    } finally {
      setIsDeleting(false);
      setFaqToDelete(null);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedFaqs = filteredFaqs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-4 sm:space-y-6 bg-slate-50 ">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              className="w-full py-2.5 pr-[40px] pl-[10px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">

          <button
            onClick={() => openModal(null)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} /> <span>Add FAQ</span>
          </button>
        </div>
      </div>
      {/* ================= MOBILE CARDS ================= */}

      <div className="md:hidden space-y-4 ">

        {loading ? (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            <p className="text-sm text-slate-500 mt-2">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No FAQs found.</p>
        ) : (

          paginatedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white"
            >
              {/* CATEGORY */}
              <div className="flex gap-2 justify-end pb-2">

                <div className="mt-3">
                  <span className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-900">
                    {faq.category}
                  </span>
                </div>


              </div>

              {/* HEADER */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-9">
                    {faq.answer}
                  </p>
                </div>

              </div>



              {/* ACTIONS */}
              <div className="flex items-center justify-between pt-2">
                {/* STATUS */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleStatus(faq.id, faq.status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${faq.status === "published"
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                  >
                    {faq.status === "published" ? "Enable" : "Disable"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(faq)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteFaq(faq.id)}
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">#</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">FAQ Details</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
                    <p className="mt-2 text-sm text-slate-500">Loading FAQs...</p>
                  </td>
                </tr>
              ) : filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No FAQs found.
                  </td>
                </tr>
              ) : (
                paginatedFaqs.map((faq, index) => (
                  <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors">

                    {/* INDEX */}
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                      {startIndex + index + 1}
                    </td>

                    {/* FAQ DETAILS */}
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">
                          {faq.question}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-[5px] rounded-lg text-[12px] bg-gray-100 text-gray-900 font-medium">
                        {faq.category}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(faq.id, faq.status)}
                        className={`px-3 py-[5px] rounded-lg text-[12px] font-medium transition-all ${faq.status === "published"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                      >
                        {faq.status === "published" ? "Enable" : "Disable"}
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(faq)}
                          className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => deleteFaq(faq.id)}
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
      {!loading && filteredFaqs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-slate-50 rounded-lg shrink-0">
          {/* Info text */}
          <span className="text-xs sm:text-sm text-slate-500 font-medium text-center sm:text-left">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredFaqs.length === 0 ? 0 : startIndex + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-slate-700">
              {Math.min(startIndex + itemsPerPage, filteredFaqs.length)}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {filteredFaqs.length}
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
      )}

      {/* FAQ Form Modal */}
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
              <div className="flex justify-between items-center mb-6 ">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingFaq ? "Edit FAQ" : "Add FAQ"}
                  </h3>

                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className=" space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Category</label>
                      <select
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 appearance-none bg-white"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                        Status
                      </label>

                      <div className="flex gap-2 flex-wrap">
                        {['published', 'draft', 'archived'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setFormData({ ...formData, status })}
                            className={`px-4 py-2 rounded-lg text-[10px] items-center font-bold uppercase tracking-wider transition-all border ${formData.status === status
                              ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-600  uppercase tracking-wider">Question</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 bg-white"
                      placeholder="e.g. How often should I service my RO system?"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-600  uppercase tracking-wider">Answer</label>
                    <textarea
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 bg-white min-h-[150px] resize-none"
                      placeholder="Provide a clear and concise answer..."
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    />
                  </div>


                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]"                                >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {editingFaq ? "Update FAQ" : "Save FAQ"}
                  </button>
                </div>
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete FAQ?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to remove this question? This action cannot be undone.
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
