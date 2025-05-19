import { logout } from "../../utils/auth";

const LogoutButton = () => {
  const handleLogout = async () => {
    await logout();
    alert("Logged out!");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
