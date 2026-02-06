import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import OrdersList from "./pages/admin/OrdersList";
import NewOrder from "./pages/admin/NewOrder";
import OrderDetail from "./pages/admin/OrderDetail";
import Home from "./pages/public/Home";
import ProtectedRoute from "./ProtectedRoute";
import "./utils/sweetalert.css";

export default function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/new-order"
          element={
            <ProtectedRoute>
              <NewOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
