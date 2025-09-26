import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../utils/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.username || user.name || "Admin";
      }
      return "Admin";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return "Admin";
    }
  };

  const username = getUserData();

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await api.post("auth/logout/", { refresh });
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      // ✅ Clear localStorage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
    }
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Sidebar */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 relative">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-500 to-green-600">
          <h1 className="font-bold text-xl text-white tracking-wide">Admin Panel</h1>
          <p className="text-green-100 text-sm mt-1">Management System</p>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1">
          <Link 
            to="/admin" 
            className="group flex items-center py-3 px-4 rounded-lg text-gray-700 
                       hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 
                       hover:text-green-700 hover:shadow-sm hover:scale-105 
                       transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-green-500"
          >
            <span className="flex-1 font-medium">📊 Dashboard</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
          
          <Link 
            to="/admin/users" 
            className="group flex items-center py-3 px-4 rounded-lg text-gray-700 
                       hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 
                       hover:text-blue-700 hover:shadow-sm hover:scale-105 
                       transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-blue-500"
          >
            <span className="flex-1 font-medium">👥 Users</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
          
          <Link 
            to="/admin/files" 
            className="group flex items-center py-3 px-4 rounded-lg text-gray-700 
                       hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 
                       hover:text-purple-700 hover:shadow-sm hover:scale-105 
                       transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-purple-500"
          >
            <span className="flex-1 font-medium">📁 Files</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
          
          <Link 
            to="/admin/settings" 
            className="group flex items-center py-3 px-4 rounded-lg text-gray-700 
                       hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 
                       hover:text-orange-700 hover:shadow-sm hover:scale-105 
                       transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-orange-500"
          >
            <span className="flex-1 font-medium">⚙️ Settings</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
        </nav>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Professional Header */}
        <header className="bg-white shadow-lg border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Welcome, {username}</h1>
              <p className="text-xs text-gray-500">Administrator Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg 
                       shadow-md hover:bg-red-700 hover:scale-105 hover:-translate-y-0.5
                       transition-all duration-300 transform hover:shadow-lg
                       border border-red-600 hover:border-red-700
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}