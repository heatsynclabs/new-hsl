import { Outlet } from "react-router-dom";
import NavBar from "../shared/NavBar";

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
