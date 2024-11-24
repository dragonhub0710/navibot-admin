import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export function Layout() {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="relative h-full w-full">
      {auth.isAuthenticated ? <Outlet /> : <Navigate to="/signin" />}
    </div>
  );
}

export default Layout;
