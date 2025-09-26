// src/pages/Dashboard/UserDashboard.tsx
import UserLayout from "../../layouts/UserLayout";

export default function UserDashboard() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Files
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your uploaded files here.
        </p>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              File Management
            </h2>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition">
              Upload File
            </button>
          </div>

          {/* Example File Table */}
          <table className="min-w-full text-sm text-left">
            <thead className="border-b dark:border-gray-700">
              <tr>
                <th className="px-4 py-2">File Name</th>
                <th className="px-4 py-2">Uploaded By</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="px-4 py-2">report.pdf</td>
                <td className="px-4 py-2">current_user</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">
                    Download
                  </button>
                  <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}
