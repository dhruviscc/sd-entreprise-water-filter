'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    Calendar,
    AlertTriangle,
    X,
    Save,
    Upload,
    Image as ImageIcon,
    PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser } from '@/modules/auth/sessionService';

interface Blog {
    id: string;
    title: string;
    category: string;
    slug: string;
    status: string;
    created_at: string;
    image: string;
    summary: string;
    content: string;
    published_at?: string | null;
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Water Quality',
        summary: '',
        content: '',
        image: '',
        status: 'draft',

    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/admin/api/blog');
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to fetch blogs');
            }
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error instanceof Error ? error.message : error);
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (blog: Blog | null = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                slug: blog.slug || '',
                category: blog.category || 'Water Quality',
                summary: blog.summary || '',
                content: blog.content || '',
                image: blog.image || '',
                status: blog.status || 'draft',

            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                slug: '',
                category: 'Water Quality',
                summary: '',
                content: '',
                image: '',
                status: 'draft',

            });
        }
        setIsModalOpen(true);
    };

    const slugify = (value: string) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: slugify(title)
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image size must be less than 4MB");
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/admin/api/upload', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Upload failed");

            setFormData(prev => ({ ...prev, image: data.url }));
            toast.success("Image uploaded successfully");
        } catch (err: any) {
            toast.error(err?.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title) {
            toast.error("Title is required");
            return;
        }

        setIsSaving(true);
        try {
            const session = await getCurrentUser();
            const user = session?.user;

            const publishedAt = formData.status === 'published'
                ? (editingBlog?.published_at || new Date().toISOString())
                : null;

            const payload = {
                ...formData,
                updated_at: new Date().toISOString(),
                published_at: publishedAt,
                author_id: editingBlog ? undefined : user?.id,
            };

            const method = editingBlog ? 'PUT' : 'POST';
            const url = editingBlog ? `/admin/api/blog?id=${editingBlog.id}` : '/admin/api/blog';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to save blog');
            }

            toast.success(`Blog ${editingBlog ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchBlogs();
        } catch (err: any) {
            toast.error(err?.message || "Failed to save blog");
        } finally {
            setIsSaving(false);
        }
    };

    const togglePublish = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

        try {
            const res = await fetch(`/admin/api/blog?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, published_at: publishedAt })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to update status');
            }
            setBlogs(blogs.map(b => b.id === id ? { ...b, status: newStatus } : b));
            toast.success(newStatus === 'published' ? 'Post published' : 'Post unpublished');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error updating status');
        }
    };

    const deleteBlog = async (id: string) => {
        setBlogToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!blogToDelete) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/admin/api/blog?id=${blogToDelete}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to delete blog');
            }
            setBlogs(blogs.filter(b => b.id !== blogToDelete));
            toast.success('Blog deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error deleting blog');
        } finally {
            setIsDeleting(false);
            setBlogToDelete(null);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-[10px] text-slate-800 bg-slate-50 min-h-screen space-y-6">
            <div className="flex justify-between items-center mb-4">

                <div className="search-center">
                    <div className="relative w-fit">
                        <input
                            className="py-[11px] pr-[40px] pl-[16px] w-[320px] rounded-lg border border-gray-200 outline-none bg-white text-sm transition-all focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                            placeholder="Search Blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-sky flex items-center justify-center p-1 rounded-full transition-all hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                                onClick={() => setSearchTerm("")}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => { openModal(null); }}
                        className="px-4 py-2 text-sm border-none  rounded-[10px] bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-semibold cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap hover:bg-sky-700 hover:from-sky-700 via-sky-700 to-slate-700 transform transition duration-300 ease-in-out hover:scale-105"
                    >
                        <Plus size={18} /> Add Blog
                    </button>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">#</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Article</th>

                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Category</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Status</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Date</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                                </td>
                            </tr>
                        ) : filteredBlogs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No blogs found.
                                </td>
                            </tr>
                        ) : (
                            filteredBlogs.map((blog, index) => (
                                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {blog.image && (
                                                <div className="w-15 h-15 relative rounded overflow-hidden border">
                                                    <Image
                                                        src={blog.image}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                            <div className="max-w-xs truncate">
                                                <div className="font-sm text-sm text-gray-900 truncate">{blog.title}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-600">
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                onClick={() => togglePublish(blog.id, blog.status)}
                                                className={`px-3 py-[5px] rounded-lg text-[12px] font-medium cursor-pointer border border-transparent transition-all ${blog.status === "published"
                                                    ? "bg-green-100 text-green-800 "
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                title={blog.status === "published" ? "Click to Unpublish" : "Click to Publish"}
                                            >
                                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                            </span>


                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <div className="flex gap-2">

                                            <button
                                                onClick={() => openModal(blog)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#083574] text-sky-600 bg-[#eff6ff]  hover:bg-[#dbeafe] cursor-pointer transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => deleteBlog(blog.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] cursor-pointer transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>

            {/* Proper Blog Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-700">
                                {editingBlog ? "Edit Blog" : "Create New Blog"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all"
                                        placeholder="Article title..."
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all"
                                    >
                                        <option value="Water Quality">Water Quality</option>
                                        <option value="Health">Health</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Featured Image</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all"
                                        placeholder="Image URL or upload..."
                                    />
                                    <label className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl cursor-pointer hover:bg-sky-100 transition-colors font-bold whitespace-nowrap">
                                        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                        Upload
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isUploading} />
                                    </label>
                                </div>
                                {formData.image && (
                                    <div className="mt-2 w-32 h-20 relative rounded-lg overflow-hidden border border-gray-100">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" unoptimized />
                                    </div>
                                )}
                            </div>


                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Excerpt</label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all min-h-[80px]"
                                    placeholder="Short summary for list pages..."
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>



                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Content (Markdown/HTML supported)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all min-h-[250px] font-mono text-sm"
                                    placeholder="Main article body..."
                                />
                            </div>


                            <div className="flex gap-4 mt-8 pt-4 ">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 px-4 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 disabled:opacity-70">
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    {editingBlog ? "Update Post" : "Save Article"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1001] animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 mb-8">
                                Are you sure you want to delete this blog post? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => { setIsDeleteModalOpen(false); setBlogToDelete(null); }}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
