import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import api from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
      // Clear localStorage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
    }
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Fixed Professional Sidebar */}
      <aside className={`fixed left-0 top-0 w-64 h-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} z-40 overflow-y-auto`}>
        {/* Brand Header */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700 bg-gradient-to-r from-green-600 to-green-700' : 'border-gray-100 bg-gradient-to-r from-green-500 to-green-600'}`}>
          <h1 className="font-bold text-xl text-white tracking-wide">Admin Panel</h1>
          <p className="text-green-100 text-sm mt-1">Management System</p>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1">
          <Link 
            to="/admin" 
            className={`group flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-green-500 hover:scale-105
                       ${theme === 'dark' 
                         ? 'text-gray-300 hover:bg-gradient-to-r hover:from-green-900 hover:to-green-800 hover:text-green-300 hover:shadow-md' 
                         : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-sm'}`}
          >
            <span className="flex-1 font-medium">📊 Dashboard</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
          
          <Link 
            to="/admin/users" 
            className={`group flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-blue-500 hover:scale-105
                       ${theme === 'dark' 
                         ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-800 hover:text-blue-300 hover:shadow-md' 
                         : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'}`}
          >
            <span className="flex-1 font-medium">👥 Users</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
          
          <Link 
            to="/admin/files" 
            className={`group flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-purple-500 hover:scale-105
                       ${theme === 'dark' 
                         ? 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-900 hover:to-purple-800 hover:text-purple-300 hover:shadow-md' 
                         : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 hover:shadow-sm'}`}
          >
            <span className="flex-1 font-medium">📁 Files</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
          
          <Link 
            to="/admin/settings" 
            className={`group flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform
                       border-l-4 border-transparent hover:border-orange-500 hover:scale-105
                       ${theme === 'dark' 
                         ? 'text-gray-300 hover:bg-gradient-to-r hover:from-orange-900 hover:to-orange-800 hover:text-orange-300 hover:shadow-md' 
                         : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 hover:shadow-sm'}`}
          >
            <span className="flex-1 font-medium">⚙️ Settings</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
          </Link>
        </nav>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
      </aside>

      {/* Main Content - Now with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Professional Header */}
        <header className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-b px-6 py-4 flex justify-between items-center z-30`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Welcome, {username}</h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Administrator Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105
                         ${theme === 'dark' 
                           ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 border border-gray-600' 
                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

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
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
          <div className="p-6 min-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}