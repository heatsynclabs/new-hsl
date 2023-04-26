import { useEffect, useState } from "react";

export default function DoorStatus() {
  const [doorStatus, setDoorStatus] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function getDoorStatus() {
      try {
        const response = await fetch(
          "https://members.heatsynclabs.org/space_api.json"
        );
        const doorStatus = response.json();
        setDoorStatus(doorStatus);
      } catch (error) {
        setError(true);
      }
    }
    getDoorStatus();
  }, []);

  return (
    <>
      {" "}
      {doorStatus && !error && (
        <span className={doorStatus.open ? "open" : "closed"}>
          {doorStatus.open
            ? "open, come on down!"
            : "closed, check the calendar!"}
        </span>
      )}
      {!doorStatus && !error && (
        <span id="door_status">
          <i className="icon-spinner icon-spin"></i>
        </span>
      )}
      {error && (
        <span>Error occurred while fetching status, please refresh.</span>
      )}
    </>
  );
}
