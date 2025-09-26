import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import UserDashboard from "./pages/Dashboard/UserDashboard"; // ✅ existing
import UserManagement from "./pages/Dashboard/UserManagement"; // 🆕 new
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
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
        
        {/* Admin User Management - 🆕 NEW ROUTE */}
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;