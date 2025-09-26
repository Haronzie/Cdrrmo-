import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import UserManagement from "./pages/Dashboard/UserManagement";
import Settings from "./pages/Dashboard/Settings";
import AdminLayout from "./layouts/AdminLayout";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <DashboardHome />
              </AdminLayout>
            }
          />
          
          {/* Admin User Management */}
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            }
          />

          {/* Admin Settings */}
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <Settings />
              </AdminLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;