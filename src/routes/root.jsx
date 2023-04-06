import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import "./index.css";

export default function Root() {
  return (
    <>
      <NavBar />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
