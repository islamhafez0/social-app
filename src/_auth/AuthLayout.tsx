import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <div className="w-full flex items-center justify-between">
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <img
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            src="/assets/images/side-img.svg"
            alt="form image"
          />
          <section className="flex items-center justify-center flex-1 flex-col pb-10 pt-20">
            <Outlet />
          </section>
        </>
      )}
    </div>
  );
};

export default AuthLayout;
