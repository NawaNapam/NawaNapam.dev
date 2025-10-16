import Private from "@/components/auth/Private";
import UpdateProfileForm from "@/components/custom/UpdateProfileForm";
import React from "react";

const Page = () => {
  return (
    <Private>
      <UpdateProfileForm />
    </Private>
  );
};

export default Page;
