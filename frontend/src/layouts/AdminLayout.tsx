import { Link } from "react-router-dom";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-6 font-bold text-xl text-green-600">Admin Panel</div>
        <nav className="px-4 space-y-2">
          <Link to="/admin" className="block py-2 px-3 rounded hover:bg-green-50 text-gray-700">Dashboard</Link>
          <Link to="/admin/users" className="block py-2 px-3 rounded hover:bg-green-50 text-gray-700">Users</Link>
          <Link to="/admin/files" className="block py-2 px-3 rounded hover:bg-green-50 text-gray-700">Files</Link>
          <Link to="/admin/settings" className="block py-2 px-3 rounded hover:bg-green-50 text-gray-700">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">Welcome, Admin</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Logout</button>
        </header>

        {/* Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
