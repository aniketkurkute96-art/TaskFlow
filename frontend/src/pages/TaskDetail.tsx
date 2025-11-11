import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { Task, User } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [forwardUserId, setForwardUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [showForwardDialog, setShowForwardDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask();
      fetchUsers();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Failed to fetch task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleForward = async () => {
    if (!forwardUserId) {
      alert('Please select a user to forward to');
      return;
    }
    try {
      await api.post(`/tasks/${id}/forward`, { toUserId: forwardUserId });
      alert('Task forwarded successfully');
      fetchTask();
      setForwardUserId('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to forward task');
    }
  };

  const handleComplete = async () => {
    try {
      await api.post(`/tasks/${id}/complete`);
      alert('Task completed and sent for approval');
      fetchTask();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to complete task');
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      alert(`Task marked as ${status.replace('_', ' ')}`);
      fetchTask();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update task status');
    }
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    
    switch (action) {
      case 'in_progress':
        handleStatusChange('in_progress');
        break;
      case 'complete':
        handleComplete();
        break;
      case 'reject':
        handleStatusChange('rejected');
        break;
      case 'forward':
        setShowForwardDialog(true);
        break;
      default:
        break;
    }
    
    // Reset dropdown
    setTimeout(() => setSelectedAction(''), 100);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/tasks/${id}/comments`, { content: comment });
      setComment('');
      fetchTask();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add comment');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Task not found</p>
        </div>
      </Layout>
    );
  }

  const isAssignee = task.assigneeId === currentUser?.id;

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-indigo-600 hover:text-indigo-900"
          >
            ← Back
          </button>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Created {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : task.status === 'pending_approval'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.description || 'No description'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Approval Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{task.approvalType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Creator</dt>
                  <dd className="mt-1 text-sm text-gray-900">{task.creator?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assignee</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.assignee?.name || 'Not assigned'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.department?.name || 'N/A'}
                  </dd>
                </div>
                {task.amount && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${task.amount.toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {isAssignee && ['open', 'in_progress'].includes(task.status) && (
            <div className="bg-white shadow sm:rounded-lg mb-6 p-4">
              <h3 className="text-lg font-medium mb-4">Task Actions</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose an action:
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedAction}
                    onChange={(e) => handleActionSelect(e.target.value)}
                  >
                    <option value="">-- Select Action --</option>
                    {task.status === 'open' && (
                      <option value="in_progress">Mark as In Progress</option>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <option value="complete">Mark as Complete</option>
                        <option value="forward">Forward to Another User</option>
                      </>
                    )}
                    <option value="reject">Reject Task</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Forward Dialog */}
          {showForwardDialog && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Forward Task</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select user to forward to:
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={forwardUserId}
                    onChange={(e) => setForwardUserId(e.target.value)}
                  >
                    <option value="">Select user</option>
                    {users
                      .filter((u) => u.id !== currentUser?.id)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowForwardDialog(false);
                      setForwardUserId('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleForward();
                      setShowForwardDialog(false);
                    }}
                    disabled={!forwardUserId}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Forward
                  </button>
                </div>
              </div>
            </div>
          )}

          {task.nodes && task.nodes.length > 0 && (
            <div className="bg-white shadow sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium">Forward Path</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {task.nodes.map((node) => (
                    <li key={node.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{node.fromUser?.name}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{node.toUser?.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(node.forwardedAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {task.approvers && task.approvers.length > 0 && (
            <div className="bg-white shadow sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium">Approval Queue</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {task.approvers.map((approver) => (
                    <li key={approver.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Level {approver.levelOrder}:</span>
                          <span className="ml-2">{approver.approver?.name}</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            approver.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : approver.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {approver.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium">Comments</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="space-y-4 mb-4">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((c) => (
                    <div key={c.id} className="border-l-4 border-indigo-500 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{c.user?.name}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(c.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{c.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet</p>
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 border rounded px-3 py-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetail;


