import React from "react";
import Sidebar from "@/components/shared/Sidebar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <main className="root">
      <Sidebar creditBalance={user.creditBalance} />
      <div className="root-container">
        <div className="wrapper">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
