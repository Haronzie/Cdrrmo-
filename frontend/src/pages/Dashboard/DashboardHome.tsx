import { Users, FileText, Activity } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold text-gray-800">128</p>
          </div>
          <Users className="h-10 w-10 text-indigo-500" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Files Shared</h2>
            <p className="text-3xl font-bold text-gray-800">542</p>
          </div>
          <FileText className="h-10 w-10 text-green-500" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Active Sessions</h2>
            <p className="text-3xl font-bold text-gray-800">23</p>
          </div>
          <Activity className="h-10 w-10 text-red-500" />
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
          <button className="text-sm text-indigo-600 hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">admin</td>
                <td className="py-3 px-4 text-gray-600">admin@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                    Admin
                  </span>
                </td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">johndoe</td>
                <td className="py-3 px-4 text-gray-600">john@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    User
                  </span>
                </td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">janedoe</td>
                <td className="py-3 px-4 text-gray-600">jane@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    User
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
