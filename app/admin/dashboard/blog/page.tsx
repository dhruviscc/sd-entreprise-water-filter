'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align'


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
    PlusCircle,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link,
    Quote,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/client';

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
                image: '', // Default to empty string
                status: 'published', // Default to published

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
        uploadData.append('bucket', 'blogs');

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

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Underline,
            TiptapImage,
            LinkExtension.configure({
                openOnClick: false,
                linkOnPaste: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'listItem'], // Added 'listItem' for proper list alignment
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class:
                    'min-h-[450px] prose prose-slate prose-sky max-w-none p-8 focus:outline-none bg-white transition-all',
            },
        },
        onUpdate: ({ editor }) => {
            setFormData(prev => ({
                ...prev,
                content: editor.getHTML(),
            }));
        },
    });

    useEffect(() => {
        if (!editor) return;

        if (isModalOpen && editor.getHTML() !== (formData.content || '')) {
            editor.commands.setContent(formData.content || '', false);
        }
    }, [editor, formData.content, isModalOpen, editingBlog?.id]);

    const addLink = () => {
        if (!editor) return;
        const url = window.prompt('Enter the URL');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addImageToEditor = () => {
        if (!editor) return;
        const url = window.prompt('Enter image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.image) {
            toast.error("Title and Image are required");
            return;
        }

        setIsSaving(true);
        try {
            const { data: sessionData } = await supabase.auth.getUser();
            const user = sessionData?.user;

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
        <div className="space-y-4 sm:space-y-6 bg-slate-50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <input
                            className="w-full py-2.5 pr-[40px] pl-[10px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
                            placeholder="Search Blogs..."
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
                        <Plus size={18} /> <span>Add Blog</span>
                    </button>
                </div>
            </div>


            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No blogs found.</p>
                ) : (
                    filteredBlogs.map((blog, index) => (
                        <div
                            key={blog.id}
                            className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white"
                        >
                            <div className="flex items-center gap-1 text-xs text-gray-500 justify-end pb-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(blog.created_at).toLocaleDateString()}
                            </div>
                            {/* Top row */}
                            <div className="flex items-start gap-3">

                                {blog.image && (
                                    <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {blog.category}
                                    </p>


                                </div>
                            </div>


                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2">
                                {/* Status + Date */}
                                <div className="flex items-center justify-between mt-3">
                                    <span
                                        onClick={() => togglePublish(blog.id, blog.status)}
                                        className={`px-3 py-1 rounded-lg text-[12px] font-medium cursor-pointer ${blog.status === "published"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                    </span>

                                </div>
                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={() => openModal(blog)}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                    >
                                        <Edit size={16} />
                                    </button>

                                    <button
                                        onClick={() => deleteBlog(blog.id)}
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

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                            <tr>
                                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">#</th>
                                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Blog Title</th>
                                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No blogs found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog, index) => (
                                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">

                                        <td className="px-6 py-4  text-sm text-slate-400 font-mono">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {blog.image && (
                                                    <div className="w-14 h-14 relative rounded overflow-hidden">
                                                        <Image
                                                            src={blog.image}
                                                            alt={blog.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                )}
                                                <div className="font-sm text-sm text-gray-900 max-w-xs">
                                                    {blog.title}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {blog.category}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                onClick={() => togglePublish(blog.id, blog.status)}
                                                className={`px-3 py-[5px] rounded-lg text-[12px] font-medium cursor-pointer transition-all ${blog.status === "published"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(blog)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#eff6ff] text-sky-600 hover:bg-[#dbeafe]"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                <button
                                                    onClick={() => deleteBlog(blog.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#fef2f2] text-red-500 hover:bg-[#fee2e2]"
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
            </div>
            {/* Proper Blog Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-700">
                                {editingBlog ? "Edit Blog" : "Add Blog"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">


                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all"
                                    placeholder="Blog title..."
                                />
                            </div>



                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Excerpt</label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    rows={9}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all "
                                    placeholder="Short summary for list pages..."
                                />
                            </div>


                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                                        Featured Image *
                                    </label>

                                    <label className="relative w-85 h-50 border-2 border-dashed border-sky-300 rounded-xl overflow-hidden cursor-pointer hover:border-sky-500 transition-all">

                                        {formData.image ? (
                                            <>
                                                <Image
                                                    src={formData.image}
                                                    alt="Featured Preview"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />

                                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        Change Image
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-sky-50">
                                                {isUploading ? (
                                                    <Loader2 size={24} className="animate-spin text-sky-600" />
                                                ) : (
                                                    <>
                                                        <Upload size={24} className="text-sky-600 mb-2" />
                                                        <span className="text-xs font-bold text-sky-600 text-center px-2">
                                                            Upload Image
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Category </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600 outline-none transition-all"
                                    >
                                        <option value="Water Quality">Water Quality</option>
                                        <option value="Health">Health</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Water Purification">Water Purification</option>
                                        <option value="RO Systems & Maintenance">RO Systems & Maintenance</option>
                                        <option value="Domestic Filters">Domestic Filters</option>
                                        <option value="Industrial Water Treatment">Industrial Water Treatment</option>
                                        <option value="Water Softeners">Water Softeners</option>
                                        <option value="Kangen Water">Kangen Water</option>
                                        <option value="Gas Geysers">Gas Geysers</option>
                                        <option value="RO + Water Coolers">RO + Water Coolers</option>
                                        <option value="AMC Services">AMC Services</option>
                                        <option value="Product Guides">Product Guides</option>
                                        <option value="Water Quality & Health">Water Quality & Health</option>
                                        <option value="Installation & Maintenance">Installation & Maintenance</option>
                                        <option value="Customer Stories">Customer Stories</option>
                                        <option value="Industry News">Industry News</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-600 uppercase tracking-wider">Content</label>
                                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                                    {/* Modern Editor Toolbar */}
                                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-sm">
                                        {/* Formatting Group */}
                                        <div className="flex gap-1 pr-1 border-r border-slate-300">
                                            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive('bold') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`} title="Bold"><Bold size={18} /></button>
                                            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive('italic') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`} title="Italic"><Italic size={18} /></button>
                                            <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive('underline') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`} title="Underline"><UnderlineIcon size={18} /></button>
                                        </div>

                                        {/* Heading Group */}
                                        <div className="flex gap-1 px-1 border-r border-slate-300">
                                            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive('bulletList') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`} title="Bullet List"><List size={18} /></button>
                                            <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive('orderedList') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`} title="Ordered List"><ListOrdered size={18} /></button>
                                        </div>
                                        <div className="flex gap-1 px-1 border-r border-slate-300">
                                            {[1, 2, 3].map((level) => (
                                                <button key={level} type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: level as any }).run()}
                                                    className={`px-3 py-1 rounded-lg font-bold text-sm transition ${editor?.isActive('heading', { level }) ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>
                                                    H{level}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex gap-1 px-1 border-r border-slate-300">

                                            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive({ textAlign: 'left' }) ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}><AlignLeft size={18} /></button>
                                            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive({ textAlign: 'center' }) ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}><AlignCenter size={18} /></button>
                                            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive({ textAlign: 'right' }) ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}><AlignRight size={18} /></button>
                                            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                                                className={`p-2 rounded-lg transition ${editor?.isActive({ textAlign: 'justify' }) ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}><AlignJustify size={18} /></button>
                                        </div>

                                        <div className="flex gap-1 pl-1">
                                            <button type="button" onClick={addLink}
                                                className={`p-2 rounded-lg transition ${editor?.isActive('link') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`} title="Add Link"><Link size={18} /></button>
                                            <button type="button" onClick={addImageToEditor}
                                                className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition" title="Add Image"><ImageIcon size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Editor Area */}
                                    <div className="bg-white">
                                        {editor ? (
                                            <EditorContent editor={editor} />
                                        ) : (
                                            <div className="min-h-[450px] flex items-center justify-center text-slate-400 italic bg-slate-50">
                                                Initializing editor...
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 ">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]">Cancel</button>
                                <button onClick={handleSave} disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none disabled:opacity-60"
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    {editingBlog ? "Update Blog" : "Save Blog"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-[350px] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-center">
                        <div >
                            <div className="w-[60px] h-[60px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={30} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2"> Delete Blog ?</h3>
                            <p className="text-gray-500 mb-8">
                                Are you sure you want to delete this blog post? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => { setIsDeleteModalOpen(false); setBlogToDelete(null); }}
                                    disabled={isDeleting}
                                    className="flex-1 p-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-slate-200 text-slate-800 transition-colors hover:bg-slate-50"
>
                                    No, Keep it
                                </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 p-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-red-500 text-white border-none transition-colors hover:bg-red-600"
                            >
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
                </div>
    )
}
        </div >
    );
}
