import { useRouteError } from "react-router-dom";
import NavBar from "./NavBar";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <NavBar />
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>
            {error.status === 404
              ? "The page you tried to reach was not found."
              : null}
          </i>
        </p>
        <p>
          <i>
            {" "}
            If the error persists, please reach out in the{" "}
            <a
              href="https://groups.google.com/forum/?fromgroups#!forum/heatsynclabs"
              alt="HSL Google Group"
              target="_blank"
              rel="noreferrer"
            >
              Discussion Group
            </a>{" "}
          </i>
        </p>
      </div>
    </>
  );
}
