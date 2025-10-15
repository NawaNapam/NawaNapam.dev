import Private from "@/components/auth/Private";
import Dashboard from "@/components/custom/Dashboard";
import React from "react";

const Page = () => {
  return (
    <Private>
      <Dashboard />
    </Private>
  );
};

export default Page;
