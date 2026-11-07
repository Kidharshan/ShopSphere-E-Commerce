// ==============================================================
// PAGE: AdminUsersPage (User & Role RBAC Management)
// File: src/pages/AdminUsersPage.jsx
// Student Implementation: View user records, update roles, delete accounts
// ==============================================================

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserCheck, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load users');
      }
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Update role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Role update failed');
      }

      setFeedback({ type: 'success', message: `User role updated to '${newRole}'!` });
      setTimeout(() => setFeedback(null), 3000);

      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser?._id) {
      setFeedback({ type: 'error', message: 'You cannot delete your own active administrator account!' });
      return;
    }

    if (!window.confirm(`Delete user '${userName}'?`)) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'User deletion failed');
      }

      setFeedback({ type: 'success', message: `User '${userName}' removed successfully.` });
      setTimeout(() => setFeedback(null), 3000);
      fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            User Accounts & Role Permissions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            RBAC Access Control: Manage Admin privileges and Customer shopper records
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {feedback && <FeedbackBanner type={feedback.type} message={feedback.message} />}
      {loading && <FeedbackBanner type="loading" message="Loading user directory..." />}
      {error && <FeedbackBanner type="error" message={error} onRetry={fetchUsers} />}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Role Privileges</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Delete Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-gray-50/60 transition">
                      <td className="p-4">
                        <span className="font-bold text-gray-900 block">{u.name}</span>
                        {isSelf && (
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                            (Current Session)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="p-4 text-gray-500">
                        {u.phone || 'Not provided'}
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`p-1.5 rounded-lg text-xs font-bold border ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          } ${isSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={isSelf}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isSelf ? 'Cannot delete own account' : 'Delete user'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
