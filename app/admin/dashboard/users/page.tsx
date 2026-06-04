"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus, Edit, Trash2, X, Key, Eye, EyeOff } from "lucide-react";

import { addUser, deleteUser, getUsers, updateUser } from "@/modules/auth/userService";
import { getCurrentUser } from "@/modules/auth/sessionService";
import { toast } from "sonner";


export default function UsersPage() {
  
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const router = useRouter();

    // Add User State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState("user");

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editMobile, setEditMobile] = useState("");
    const [editRole, setEditRole] = useState("admin");
    const [editStatus, setEditStatus] = useState("active");

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    // Reset password modal state
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetUser, setResetUser] = useState<any>(null);
    const [resetPassword, setResetPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

    // Fetch users
    const fetchUsers = async (query = "") => {
        setLoading(true);
        console.log("UsersPage: Fetching users, query:", query);
        try {
            const { user } = await getCurrentUser();
            if (!user) {
                router.push('/login');
                return;
            }
            console.log("UsersPage: Current user:", user?.id, user?.email);

            const data = await getUsers(query);
            console.log("UsersPage: Received data from getUsers:", data);

            if (data && !data.error) {
                const role = (user?.role || user?.user_metadata?.role || "").toLowerCase();
                const uName = user?.name || user?.email?.split('@')[0] || "";
                console.log("UsersPage: Identified role:", role, "name:", uName);

                const adminCheck = ["admin", "manager", "staff", "accountant", "inventory manager"].includes(role) || uName.toLowerCase() === "admin";
                console.log("UsersPage: adminCheck result:", adminCheck);

                setIsAdmin(adminCheck);
                setLoggedInUser(user);

                if (adminCheck) {
                    setUsers(data);
                } else {
                    const filtered = data.filter((u: any) => u.id === user?.id || (user?.email && u.email === user?.email));
                    console.log("UsersPage: Non-admin, filtered data:", filtered);
                    setUsers(filtered);
                }
            } else {
                console.log("UsersPage: data is null or has error:", data?.error);
            }
        } catch (e) {
            console.error("UsersPage: Error in fetchUsers:", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchUsers(debouncedSearch);
    }, [debouncedSearch]);



   
    // Add User
    useEffect(() => {
        if (!isResetModalOpen) {
            setShowResetPassword(false);
            setShowResetConfirmPassword(false);
        }
    }, [isResetModalOpen]);

    const handleAddUser = async (e: any) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim() || !mobile.trim()) return;

        setLoading(true);
        try {
            await addUser({ name, email, password, mobile, role });
            setName("");
            setEmail("");
            setPassword("");
            setMobile("");
            setRole("admin");
            setIsAddModalOpen(false);
            toast.success("User added successfully!");
            fetchUsers(debouncedSearch);
        } catch (error: any) {
            toast.error("Error adding user: " + error.message);
        }
        setLoading(false);
    };

    // Open Delete Modal
    const openDeleteModal = (user: any) => {
        if (user.role === "admin" || user.name.toLowerCase() === "admin") {
            toast.error("Cannot delete admin users directly.");
            return;
        }
        setUserToDelete(user);
        setIsDeleting(false);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete User
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await deleteUser(userToDelete.id);
            toast.success("User deleted successfully!");
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers(debouncedSearch);
        } catch (error: any) {
            toast.error("Error deleting user: " + error.message);
            setIsDeleting(false);
        }
    };

    // Toggle Status
    const handleToggleStatus = async (id: string, current: string) => {
        const newStatus = current === "active" ? "inactive" : "active";
        try {
            await updateUser(id, { status: newStatus });
            toast.success("Status updated successfully!");
            fetchUsers(debouncedSearch);
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to toggle status: " + error.message);
        }
    };

    // Open Edit Modal
    const openEditModal = (user: any) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditMobile(user.mobile || "");
        setEditRole(user.role || "user");
        setEditStatus(user.status || "active");
        setIsEditModalOpen(true);
    };

    // Update User
    const handleUpdateUser = async () => {
        if (!editName.trim() || !editingUser) return;

        try {
            await updateUser(editingUser.id, {
                name: editName,
                mobile: editMobile,
                email: editEmail,
                role: editRole,
                status: editStatus,
            });
            toast.success("User updated successfully!");
            setIsEditModalOpen(false);
            fetchUsers(debouncedSearch);
        } catch (error: any) {
            toast.error("Error updating user: " + error.message);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <input
                            className="w-full py-2.5 pr-[40px] pl-[16px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
                            placeholder="Search Users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                onClick={() => setSearch("")}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

             <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={18} /> <span>Add User</span>
                    </button>
                </div>
            </div>

      {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">#</th>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">Name</th>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">Email</th>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">Mobile</th>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">Role</th>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                            <th className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center p-[48px] text-sky-600">
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center p-[48px] text-sky-600">
                                    No users found. Start by adding one above.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-[#f1f5f9]">
                                    <td className="px-4 py-[14px] text-sm border-b border-[#e2e8f0] text-[#1e293b]">{index + 1}</td>

                                    <td className="px-4 py-[14px] text-sm border-b border-[#e2e8f0] text-[#1e293b]" style={{ fontWeight: 500 }}>{user.name}</td>
                                    <td className="px-4 py-[14px] text-sm border-b border-[#e2e8f0] text-[#1e293b]">{user.email}</td>
                                    <td className="px-4 py-[14px] text-sm border-b border-[#e2e8f0] text-[#1e293b]">{user.mobile || "-"}</td>
                                    <td className="px-4 py-[14px] text-sm border-b border-[#e2e8f0] text-[#1e293b]">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#f1f5f9] text-[#475569]">{user.role}</span>
                                    </td>
                                    <td className="px-4 py-[14px] text-sm border-b border-[#e2e8f0] text-[#1e293b]">
                                        <button
                                            className={`px-3 py-[5px] rounded-lg text-[12px] font-medium cursor-pointer border border-transparent transition-all ${user.status === 'active' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}
                                            onClick={() => isAdmin && handleToggleStatus(user.id, user.status)}
                                            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                                        >
                                            {user.status === 'active' ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-[14px] text-sm  border-b border-[#e2e8f0] text-[#1e293b] flex gap-2">

                                        <>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-slate-700 bg-[#f8fafc] hover:bg-[#e2e8f0] cursor-pointer transition-all"
                                                title="Reset Password"
                                                onClick={() => {
                                                    setResetUser(user);
                                                    setResetPassword("");
                                                    setResetConfirmPassword("");
                                                    setIsResetModalOpen(true);
                                                }}
                                            >
                                                <Key size={16} />
                                            </button>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-sky-600 bg-[#eff6ff] hover:bg-[#dbeafe] cursor-pointer transition-all"
                                                title="Edit User"
                                                onClick={() => openEditModal(user)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] cursor-pointer transition-all"
                                                title="Delete User"
                                                onClick={() => openDeleteModal(user)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>



            {/* Add User Modal */}
            {isAddModalOpen && (
                 <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Create New User</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form className="flex flex-col gap-3.5" style={{ flexDirection: "column" }} onSubmit={handleAddUser}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider"> Name *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Email *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Password *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Mobile *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="text"
                                        placeholder="Mobile"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Role *</label>
                                <select className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10" value={role} onChange={(e) => setRole(e.target.value)} required>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b] " onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm  bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none " disabled={loading}>
                                    {loading ? "Adding..." : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

      

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Edit User</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3.5" style={{ flexDirection: "column" }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Name *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Name"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Email *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="email"
                                        placeholder="Email"
                                        value={editEmail}
                                        disabled
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Mobile *</label>
                                    <input
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type="text"
                                        value={editMobile}
                                        onChange={(e) => setEditMobile(e.target.value)}
                                        placeholder="Mobile"
                                        maxLength={10}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Role *</label>
                                    <select className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b] " onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none " onClick={handleUpdateUser}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetModalOpen && resetUser && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">
                                Reset Password
                            </h3>
                            <button onClick={() => setIsResetModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3.5" style={{ flexDirection: "column" }}>
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">New Password *</label>
                                <div className="relative">
                                    <input
                                        className="w-full px-3.5 py-[11px] pr-10 rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type={showResetPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={resetPassword}
                                        onChange={(e) => setResetPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowResetPassword(!showResetPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 focus:outline-none"
                                    >
                                        {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Confirm Password *</label>
                                <div className="relative">
                                    <input
                                        className="w-full px-3.5 py-[11px] pr-10 rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        type={showResetConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={resetConfirmPassword}
                                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 focus:outline-none"
                                    >
                                        {showResetConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]" onClick={() => setIsResetModalOpen(false)} disabled={isResetting}>
                                Cancel
                            </button>
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none" onClick={async () => {
                                if (!resetPassword.trim() || !resetConfirmPassword.trim()) {
                                    toast.error("Please enter and confirm the new password.");
                                    return;
                                }
                                if (resetPassword !== resetConfirmPassword) {
                                    toast.error("Passwords do not match.");
                                    return;
                                }
                                setIsResetting(true);
                                try {
                                    await updateUser(resetUser.id, { password: resetPassword });
                                    toast.success("Password reset successfully.");
                                    setIsResetModalOpen(false);
                                    setResetUser(null);
                                    setResetPassword("");
                                    setResetConfirmPassword("");
                                } catch (error: any) {
                                    toast.error("Error resetting password: " + (error?.message || error));
                                } finally {
                                    setIsResetting(false);
                                }
                            }} disabled={isResetting}>
                                {isResetting ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out text-center">

                        <div style={{ marginBottom: "20px" }}>
                            <div className="w-[60px] h-[60px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={30} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2">Delete User?</h3>
                            <p className="text-sky-600 text-[14px] m-0">
                                Are you sure you want to delete <b>{userToDelete?.name}</b>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-gray-50 disabled:opacity-50" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                                No, Keep it
                            </button>
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm text-white border-none bg-red-600 hover:bg-red-700 transition-colors disabled:bg-red-400" onClick={confirmDeleteUser} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Yes, Delete!"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
