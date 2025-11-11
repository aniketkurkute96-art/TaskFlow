import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { Task } from '../types';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/tasks/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Task
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Open Tasks</div>
            <div className="text-2xl font-bold">{stats?.taskCounts?.open || 0}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">In Progress</div>
            <div className="text-2xl font-bold">{stats?.taskCounts?.in_progress || 0}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Pending Approval</div>
            <div className="text-2xl font-bold">{stats?.taskCounts?.pending_approval || 0}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Approval Bucket</div>
            <div className="text-2xl font-bold text-indigo-600">
              {stats?.approvalBucketCount || 0}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Overdue</div>
            <div className="text-2xl font-bold text-red-600">
              {stats?.overdueTasks?.length || 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">My Tasks</h2>
            </div>
            <div className="p-4">
              {stats?.myTasks?.length > 0 ? (
                <div className="space-y-3">
                  {stats.myTasks.map((task: Task) => (
                    <Link
                      key={task.id}
                      to={`/tasks/${task.id}`}
                      className="block p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(task.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
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
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No tasks found</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Overdue Tasks</h2>
            </div>
            <div className="p-4">
              {stats?.overdueTasks?.length > 0 ? (
                <div className="space-y-3">
                  {stats.overdueTasks.map((task: Task) => (
                    <Link
                      key={task.id}
                      to={`/tasks/${task.id}`}
                      className="block p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-500">
                            Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                          Overdue
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No overdue tasks</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

