import { Users, FileText, Activity, TrendingUp, Calendar, Clock, UserPlus } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between 
                        hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer">
          <div>
            <h2 className="text-sm text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold text-gray-800">128</p>
            <p className="text-xs text-green-600 mt-1">↗ +12% this month</p>
          </div>
          <Users className="h-10 w-10 text-indigo-500" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between 
                        hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer">
          <div>
            <h2 className="text-sm text-gray-500">Files Shared</h2>
            <p className="text-3xl font-bold text-gray-800">542</p>
            <p className="text-xs text-green-600 mt-1">↗ +8% this week</p>
          </div>
          <FileText className="h-10 w-10 text-green-500" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between 
                        hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer">
          <div>
            <h2 className="text-sm text-gray-500">Active Sessions</h2>
            <p className="text-3xl font-bold text-gray-800">23</p>
            <p className="text-xs text-yellow-600 mt-1">→ Same as yesterday</p>
          </div>
          <Activity className="h-10 w-10 text-red-500" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between 
                        hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer">
          <div>
            <h2 className="text-sm text-gray-500">New Today</h2>
            <p className="text-3xl font-bold text-gray-800">7</p>
            <p className="text-xs text-blue-600 mt-1">↗ +3 from yesterday</p>
          </div>
          <UserPlus className="h-10 w-10 text-blue-500" />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Analytics */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Traffic Analytics</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Page Views Today</span>
              <span className="font-semibold text-gray-800">1,247</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unique Visitors</span>
              <span className="font-semibold text-gray-800">892</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="font-semibold text-red-600">23.4%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{width: '23%'}}></div>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">System Performance</h2>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="font-semibold text-gray-800">67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '67%'}}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="font-semibold text-gray-800">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="font-semibold text-gray-800">123.5 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '82%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Users Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users - Card Layout */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            <button className="text-sm text-indigo-600 hover:underline font-medium">View All</button>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">admin</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 mt-1 inline-block">
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">johndoe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mt-1 inline-block">
                  User
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">janedoe</p>
                <p className="text-xs text-gray-500">jane@example.com</p>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mt-1 inline-block">
                  User
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">mikejones</p>
                <p className="text-xs text-gray-500">mike@example.com</p>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mt-1 inline-block">
                  User
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">Add New User</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition duration-200">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">Upload Files</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-200">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-700">View Reports</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition duration-200">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-700">Schedule Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New user registration: johndoe</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">File uploaded: project_report.pdf</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">System backup completed successfully</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}