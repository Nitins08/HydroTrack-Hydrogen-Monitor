import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { 
  Users, 
  ShieldCheck, 
  HardHat, 
  Trash2, 
  Loader2,
  X,
  AlertTriangle,
  Lock,
  UserCheck
} from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/SkeletonLoader';
import AnimatedCounter from '../components/AnimatedCounter';
import { 
  pageVariants, 
  staggerContainer, 
  cardVariants, 
  tableRowVariants, 
  modalOverlayVariants, 
  modalContentVariants 
} from '../utils/animations';

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalAdmins: 0, totalOperators: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action states
  const [roleUpdatingId, setRoleUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        showToast(`Role for ${targetUser.name} updated to ${newRole.toUpperCase()}.`, 'success');
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update user role.', 'error');
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
        showToast(`Account for ${deleteTarget.name} was permanently removed.`, 'success');
        setDeleteTarget(null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to delete user account.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200/70 animate-pulse rounded-[3px] w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200/70 animate-pulse rounded-[3px]" />
          <div className="h-24 bg-gray-200/70 animate-pulse rounded-[3px]" />
          <div className="h-24 bg-gray-200/70 animate-pulse rounded-[3px]" />
        </div>
        <SkeletonTable rows={5} columns={6} />
      </div>
    );
  }

  if (error && users.length === 0) {
    return <ErrorState message={error} onRetry={fetchUsers} />;
  }

  const currentUserId = currentUser?._id || currentUser?.id;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 dark:border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            System User Management & Role-Based Access Control (RBAC)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 text-xs font-mono rounded-[2px] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Active Admin: {currentUser?.name}</span>
          </span>
        </div>
      </div>

      {/* 3 Metric Cards with Animated Counters */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Total Users */}
        <motion.div
          variants={cardVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-teal-600 rounded-[3px] p-4 flex items-center justify-between shadow-2xs hover:border-gray-300 dark:hover:border-slate-700 transition-all"
        >
          <div>
            <span className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wide block">
              Total Accounts
            </span>
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1 block">
              <AnimatedCounter value={metrics.totalUsers} decimals={0} />
            </span>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 block">Registered platform users</span>
          </div>
          <div className="w-10 h-10 border border-teal-200 dark:border-teal-800 rounded-[2px] flex items-center justify-center text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Total Admins */}
        <motion.div
          variants={cardVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-teal-600 rounded-[3px] p-4 flex items-center justify-between shadow-2xs hover:border-gray-300 dark:hover:border-slate-700 transition-all"
        >
          <div>
            <span className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wide block">
              Administrators
            </span>
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1 block">
              <AnimatedCounter value={metrics.totalAdmins} decimals={0} />
            </span>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 block">Full CRUD & permissions</span>
          </div>
          <div className="w-10 h-10 border border-teal-200 dark:border-teal-800 rounded-[2px] flex items-center justify-center text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Total Operators */}
        <motion.div
          variants={cardVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-teal-600 rounded-[3px] p-4 flex items-center justify-between shadow-2xs hover:border-gray-300 dark:hover:border-slate-700 transition-all"
        >
          <div>
            <span className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wide block">
              Plant Operators
            </span>
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1 block">
              <AnimatedCounter value={metrics.totalOperators} decimals={0} />
            </span>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 block">Telemetry logging & review</span>
          </div>
          <div className="w-10 h-10 border border-teal-200 dark:border-teal-800 rounded-[2px] flex items-center justify-center text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50">
            <HardHat className="w-5 h-5" />
          </div>
        </motion.div>
      </motion.div>

      {/* Permissions Distinction Banner */}
      <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 text-xs shadow-2xs space-y-2 transition-colors">
        <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wide text-[11px] block">
          Role Permissions Overview
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-slate-400">
          <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-[2px] space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-gray-900 dark:text-slate-200">
              <HardHat className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Plant Operator:</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
              Allowed to monitor Dashboard, Analytics, and Sustainability. Can log new daily telemetry. Can edit <strong>only readings they created</strong>. Cannot delete readings or access the Admin Panel.
            </p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-[2px] space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-gray-900 dark:text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>System Administrator:</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
              Unrestricted access. Can edit or permanently delete <strong>any reading</strong>. Access to User Directory, role re-assignments, and operator deletion. Self-account is protected from deletion or demotion.
            </p>
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 space-y-4 hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">System User Directory</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Review platform accounts, toggle permission roles, and manage credentials
            </p>
          </div>
          <span className="text-xs text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-0.5 rounded-[2px] font-mono">
            {users.length} accounts
          </span>
        </div>

        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No user accounts registered"
            description="There are currently no registered users in the database."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-900 dark:text-slate-200 border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 font-semibold bg-gray-50 dark:bg-slate-800/60">
                <th className="py-2.5 px-3">User Details</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Role Control</th>
                <th className="py-2.5 px-3">Registered On</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="divide-y divide-gray-100 dark:divide-slate-800/80"
            >
              {users.map((targetUser) => {
                const isSelf = currentUserId && targetUser._id === currentUserId;
                const isUpdating = roleUpdatingId === targetUser._id;

                return (
                  <motion.tr 
                    key={targetUser._id} 
                    variants={tableRowVariants}
                    className="hover:bg-teal-50/20 dark:hover:bg-teal-950/20 transition-colors"
                  >
                    {/* User Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 rounded-[2px] flex items-center justify-center text-xs font-bold text-gray-800 dark:text-slate-200">
                          {targetUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
                            <span>{targetUser.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-gray-900 dark:bg-slate-700 text-white px-1.5 py-0.2 rounded-[2px] font-mono">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-3 text-gray-600 dark:text-slate-400 font-mono text-[11px]">
                      {targetUser.email}
                    </td>

                    {/* Current Role Badge */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-semibold border rounded-[2px] ${
                        targetUser.role === 'admin'
                          ? 'bg-gray-900 dark:bg-slate-800 text-white border-gray-900 dark:border-slate-700'
                          : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                      }`}>
                        {targetUser.role === 'admin' ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <HardHat className="w-3 h-3 text-teal-700 dark:text-teal-400" />
                        )}
                        <span className="capitalize">{targetUser.role}</span>
                      </span>
                    </td>

                    {/* Role Control Dropdown */}
                    <td className="py-3 px-3">
                      {isSelf ? (
                        <span className="text-[11px] text-gray-400 dark:text-slate-500 italic flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Protected (Active Admin)</span>
                        </span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <select
                            disabled={isUpdating}
                            value={targetUser.role}
                            onChange={(e) => handleRoleChange(targetUser, e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-900 dark:text-white text-xs px-2.5 py-1 rounded-[2px] focus:outline-none focus:border-teal-600 cursor-pointer transition-colors disabled:opacity-50"
                          >
                            <option value="operator">Operator</option>
                            <option value="admin">Admin</option>
                          </select>
                          {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-teal-600 dark:text-teal-400" />}
                        </div>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-3 text-gray-500 dark:text-slate-400 font-mono text-[11px]">
                      {targetUser.createdAt ? formatDate(targetUser.createdAt) : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      {isSelf ? (
                        <span className="text-[11px] text-gray-400 dark:text-slate-500 italic">
                          Self account
                        </span>
                      ) : (
                        <motion.button
                          whileHover={shouldReduceMotion ? {} : { y: -1 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                          onClick={() => setDeleteTarget(targetUser)}
                          title="Delete user account"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-slate-400 rounded-[2px] text-[11px] font-semibold transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              variants={modalOverlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setDeleteTarget(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
            />

            {/* Modal Dialog */}
            <motion.div
              variants={shouldReduceMotion ? {} : modalContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full max-w-md bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-6 text-gray-900 dark:text-white my-8 shadow-xl z-10 space-y-4"
            >
              <div className="flex items-start space-x-3 pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-[2px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                  <Trash2 className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete User Account</h3>
                  <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Are you sure you want to permanently delete the account for{' '}
                    <strong className="text-gray-900 dark:text-white font-semibold">{deleteTarget.name}</strong> (
                    <span className="font-mono text-xs text-gray-700 dark:text-slate-300">{deleteTarget.email}</span>)?
                  </p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mt-2">
                    This user will immediately forfeit access to the system.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteLoading}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-800 dark:text-slate-200 text-xs font-semibold rounded-[2px] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-[2px] transition-colors inline-flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                >
                  {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>{deleteLoading ? 'Deleting...' : 'Confirm Delete'}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
