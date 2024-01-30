import BottomBar from "@/components/shared/BottomBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Header />
      <LeftSidebar />
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
