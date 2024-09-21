import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="">
        {/* This will render the matched route's component */}
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
