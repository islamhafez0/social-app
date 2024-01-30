import { sidebarLinks } from "@/constants";
import { useUserAuthContext } from "@/context/AuthContext";
import { ISidebarLink } from "@/types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useLogoutMutattion } from "@/lib/react-query/QueriesNMutations";
import Loader from "./Loader";
const LeftSidebar = () => {
  const navigate = useNavigate();
  const { mutateAsync: logout, isPending } = useLogoutMutattion();
  const { user } = useUserAuthContext();
  async function handleLogout() {
    const loggedOut = await logout();
    if (loggedOut) {
      navigate("/sign-in");
    }
  }
  const { pathname } = useLocation();
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height="auto"
          />
        </Link>
        <Link className="flex gap-3 items-center" to={`/profile/${user.id}`}>
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt={user.name || "userImage"}
            className="w-14 h-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-4">
          {sidebarLinks.map((item: ISidebarLink) => {
            const isActive = pathname === item.route;
            return (
              <li
                key={item.label}
                className={`leftsidebar-link ${
                  isActive && "bg-primary-500"
                } group`}
              >
                <NavLink
                  to={item.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={item.imgURL}
                    alt={item.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="shad-button_ghost"
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        {isPending ? (
          <Loader />
        ) : (
          <p className="small-medium lg:base-medium">Logout</p>
        )}
      </Button>
      <p className="absolute text-light-4 bottom-2 left-6 text-center">
        &copy; Eslam Hafez {new Date().getFullYear()}
      </p>
    </nav>
  );
};

export default LeftSidebar;
