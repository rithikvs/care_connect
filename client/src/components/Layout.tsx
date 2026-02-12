import { ReactNode } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen page-gradient">
      <Navbar />
      <main className="pt-20">{children}</main>
    </div>
  );
};

export default Layout;
