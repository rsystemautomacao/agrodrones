import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Drones from "./pages/Drones";
import Operators from "./pages/Operators";
import Applications from "./pages/Applications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="drones" element={<Drones />} />
        <Route path="operators" element={<Operators />} />
        <Route path="applications" element={<Applications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
