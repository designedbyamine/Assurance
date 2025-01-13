import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/visitor/Login";
import Signup from "./pages/visitor/Signup"; // Adjust path if needed
import ClientProfile from "./pages/client/clientProfile";
import CreateConstat from "./pages/client/CreateConstat";
import MyConstats    from "./pages/client/MyConstats";
import DashboardClient from "./pages/client/DashboardClient";


import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ConstatsManagement from "./pages/admin/ConstatsManagement";
import ExpertManagement from "./pages/admin/ExpertManagement";

import Constats from "./pages/expert/Constats";

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/clientProfile" element={<ClientProfile />} />
      <Route path="/create-constat" element={<CreateConstat />} />
      <Route path="/my-constats" element={<MyConstats />} />
      <Route path="/dashboardClient" element={<DashboardClient />} />

     <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
     <Route path="/constatsmanagement" element={<ConstatsManagement />} />
     <Route path="/expertmanagement" element={<ExpertManagement />} />

     <Route path="/constats" element={<Constats />} />

      {/* Add more routes as necessary */}
    </Routes>
  );
};

export default AppRoutes;
