import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useLogoutMutattion } from "@/lib/react-query/QueriesNMutations";
import { useUserAuthContext } from "@/context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { mutateAsync: logout } = useLogoutMutattion();
  const { user } = useUserAuthContext();
  async function handleLogout() {
    const loggedOut = await logout();
    if (loggedOut) {
      navigate("/sign-in");
    }
  }
  return (
    <header className="topbar">
      <nav className="flex-between px-4 py-5">
        <Link to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="shad-button_ghost"
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`}>
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt={user.name || "userImage"}
              className="w-8 h-8 rounded-full"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
