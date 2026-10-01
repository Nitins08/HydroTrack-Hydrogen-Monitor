import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { 
  Users, 
  ShieldCheck, 
  HardHat, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalAdmins: 0, totalOperators: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action states
  const [roleUpdatingId, setRoleUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminGetUsers();
      if (res.success) {
        setUsers(res.users);
        setMetrics(res.metrics || {
          totalUsers: res.users.length,
          totalAdmins: res.users.filter((u) => u.role === 'admin').length,
          totalOperators: res.users.filter((u) => u.role === 'operator').length
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load users list. Please verify your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.role === newRole) return;
    setRoleUpdatingId(targetUser._id);
    try {
      const res = await api.adminUpdateUserRole(targetUser._id, newRole);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Role for ${targetUser.name} updated to ${newRole}.`
        });
        setTimeout(() => setNotification(null), 3000);
        // Refresh users list
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update user role.'
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await api.adminDeleteUser(deleteTarget._id);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Account for ${deleteTarget.name} was permanently removed.`
        });
        setDeleteTarget(null);
        setTimeout(() => setNotification(null), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete user account.'
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingState message="Loading administrative records..." />;
  }

  if (error && users.length === 0) {
    return <ErrorState message={error} onRetry={fetchUsers} />;
  }

  const currentUserId = currentUser?._id || currentUser?.id;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#D1D1D1] gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#111111] tracking-tight">Admin Panel</h1>
          <p className="text-xs text-[#5C5C5C] mt-0.5">
            System User Management & Role-Based Access Control
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-[#D1D1D1] text-[#111111] text-xs font-mono rounded-[2px]">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>Admin Active: {currentUser?.name}</span>
          </span>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-3 border rounded-[2px] flex items-center space-x-2 text-xs ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 border-l-4 border-l-green-600 text-green-800' 
            : 'bg-red-50 border-red-200 border-l-4 border-l-red-600 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5C5C5C] block">Total Accounts</span>
            <span className="text-2xl font-bold text-[#111111] mt-1 block">
              {metrics.totalUsers}
            </span>
            <span className="text-[11px] text-[#5C5C5C] mt-0.5 block">Registered platform users</span>
          </div>
          <div className="w-10 h-10 border border-[#D1D1D1] flex items-center justify-center text-[#111111] bg-[#FAFAFA]">
            <Users className="w-5 h-5 text-[#111111]" />
          </div>
        </div>

        {/* Total Admins */}
        <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5C5C5C] block">Administrators</span>
            <span className="text-2xl font-bold text-[#111111] mt-1 block">
              {metrics.totalAdmins}
            </span>
            <span className="text-[11px] text-[#5C5C5C] mt-0.5 block">Full CRUD & system management</span>
          </div>
          <div className="w-10 h-10 border border-[#D1D1D1] flex items-center justify-center text-[#111111] bg-[#FAFAFA]">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
        </div>

        {/* Total Operators */}
        <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5C5C5C] block">Plant Operators</span>
            <span className="text-2xl font-bold text-[#111111] mt-1 block">
              {metrics.totalOperators}
            </span>
            <span className="text-[11px] text-[#5C5C5C] mt-0.5 block">Operational monitoring & data logging</span>
          </div>
          <div className="w-10 h-10 border border-[#D1D1D1] flex items-center justify-center text-[#111111] bg-[#FAFAFA]">
            <HardHat className="w-5 h-5 text-[#5C5C5C]" />
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">User Directory</h3>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Review platform accounts, toggle permission roles, and manage credentials
            </p>
          </div>
          <span className="text-xs text-[#5C5C5C] border border-[#D1D1D1] px-2.5 py-0.5 rounded-[2px]">
            {users.length} accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#111111] border-collapse">
            <thead>
              <tr className="border-b border-[#D1D1D1] text-[#5C5C5C] font-medium bg-[#FAFAFA]">
                <th className="py-2.5 px-3">User Details</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Role Control</th>
                <th className="py-2.5 px-3">Registered On</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {users.map((targetUser) => {
                const isSelf = currentUserId && targetUser._id === currentUserId;
                const isUpdating = roleUpdatingId === targetUser._id;

                return (
                  <tr key={targetUser._id} className="hover:bg-[#F9F9F9] transition-colors">
                    {/* User Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 border border-[#D1D1D1] bg-[#FAFAFA] flex items-center justify-center text-xs font-semibold text-[#111111]">
                          {targetUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#111111] flex items-center space-x-1.5">
                            <span>{targetUser.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-black text-white px-1.5 py-0.2 rounded-[2px]">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-3 text-[#5C5C5C] font-mono">
                      {targetUser.email}
                    </td>

                    {/* Current Role Badge */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-medium border rounded-[2px] ${
                        targetUser.role === 'admin'
                          ? 'bg-black text-white border-black'
                          : 'bg-[#F5F5F5] text-[#111111] border-[#D1D1D1]'
                      }`}>
                        {targetUser.role === 'admin' ? (
                          <ShieldCheck className="w-3 h-3 text-white" />
                        ) : (
                          <HardHat className="w-3 h-3 text-[#5C5C5C]" />
                        )}
                        <span className="capitalize">{targetUser.role}</span>
                      </span>
                    </td>

                    {/* Role Control Dropdown */}
                    <td className="py-3 px-3">
                      {isSelf ? (
                        <span className="text-[11px] text-[#8C8C8C] italic">
                          Protected (Current Admin)
                        </span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <select
                            disabled={isUpdating}
                            value={targetUser.role}
                            onChange={(e) => handleRoleChange(targetUser, e.target.value)}
                            className="bg-white border border-[#D1D1D1] hover:border-black text-[#111111] text-xs px-2 py-1 rounded-[2px] focus:outline-none focus:border-black cursor-pointer transition-colors disabled:opacity-50"
                          >
                            <option value="operator">Operator</option>
                            <option value="admin">Admin</option>
                          </select>
                          {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-black" />}
                        </div>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-3 text-[#5C5C5C]">
                      {targetUser.createdAt ? formatDate(targetUser.createdAt) : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      {isSelf ? (
                        <span className="text-[11px] text-[#8C8C8C] italic">
                          Self account
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteTarget(targetUser)}
                          title="Delete user account"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-[#D1D1D1] hover:border-red-600 hover:text-red-600 text-[#5C5C5C] rounded-[2px] text-[11px] font-medium transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white border border-black w-full max-w-md p-5 rounded-[2px] shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 border border-red-600 bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">Delete User Account</h3>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  Are you sure you want to permanently delete the account for{' '}
                  <strong className="text-black font-semibold">{deleteTarget.name}</strong> (
                  <span className="font-mono text-xs">{deleteTarget.email}</span>)?
                </p>
                <p className="text-[11px] text-red-600 mt-2">
                  This action is irreversible and the user will immediately lose system access.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-3 py-1.5 bg-white border border-[#D1D1D1] hover:border-black text-[#111111] text-xs font-medium rounded-[2px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-[2px] transition-colors inline-flex items-center space-x-1"
              >
                {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>{deleteLoading ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
