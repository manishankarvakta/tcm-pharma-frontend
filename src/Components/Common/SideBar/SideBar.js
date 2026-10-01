import { signInUser } from "../../Utility/Auth";
import AdminSideBar from "./AdminSideBar";
import EcomSideBar from "./EcomSideBar";
import ManagerSideBar from "./ManagerSideBar";
import "./SideBar.css";
import SupervisorSideBar from "./SupervisorSideBar";

const SideBar = () => {
  let active = window.location.pathname;
  const user = signInUser();
  // console.log("user", user)
  // console.log(active);
  return (
    <>
      {user.type === "admin" && <AdminSideBar></AdminSideBar>}
      {user.type === "ecom" && <EcomSideBar></EcomSideBar>}
      {user.type === "manager" && <ManagerSideBar></ManagerSideBar>}
      {user.type === "supervisor" && <SupervisorSideBar></SupervisorSideBar>}
    </>
  );
};

export default SideBar;
