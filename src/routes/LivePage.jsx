import { useEffect } from "react";
import "./LivePage.css";

export default function LivePage() {
  useEffect(() => {
    const refresh = () => {
      for (let i = 1; i <= 4; i++) {
        const url = `https://live.heatsynclabs.org/snapshot.php?camera=${i}&time=${Date.now()}`;
        const img = new Image();
        img.onload = () => {
          document.getElementById("livestream" + i).src = url;
          document.getElementById("lsAnchor" + i).href = url;
        };
        img.src = url;
      }
    };

    let refreshTimer;

    const contentLoadedListener = () => {
      refreshTimer = setInterval(refresh, 10000);

      doors().then(console.log).catch(console.error);
    };
    document.addEventListener("DOMContentLoaded", contentLoadedListener);
    return () => {
      document.removeEventListener("DOMContentLoaded", contentLoadedListener);
      clearInterval(refreshTimer);
    };
  }, []);

  return (
    <div className="live">
      <div id="wrapper">
        <a href="http://www.heatsynclabs.org">
          <img src="/img/logo-light.png" height="116" />
        </a>

        <div id="content">
          <h2>HeatSync Labs Live Webcams</h2>
          <p>
            See if there are people in the lab! <br />
            The camera views refresh at least every 10 seconds, though you may
            not be able to tell if nothing's moving. <br />
            If the cameras are broken, please tweet
            <a href="https://twitter.com/Citizen4110">@Citizen4110</a> or email
            gabe at heatsynclabs dot org.
          </p>
          <p>
            Nobody here? Check the
            <a href="http://twitter.com/heatsyncstatus">HeatSyncStatus</a> feed.
            See when the next event is scheduled at the
            <a href="http://www.heatsynclabs.org">HeatSync Website</a>.
          </p>

          <div className="caption">
            <a
              id="lsAnchor1"
              href="https://live.heatsynclabs.org/snapshot.php?camera=1"
            >
              <img
                id="livestream1"
                src="https://live.heatsynclabs.org/snapshot.php?camera=1"
                width="320"
                height="240"
              />
            </a>
          </div>

          <div className="caption">
            <a
              id="lsAnchor2"
              href="https://live.heatsynclabs.org/snapshot.php?camera=2"
            >
              <img
                id="livestream2"
                src="https://live.heatsynclabs.org/snapshot.php?camera=2"
                width="320"
                height="240"
              />
            </a>
          </div>

          <div className="caption">
            <a
              id="lsAnchor3"
              href="https://live.heatsynclabs.org/snapshot.php?camera=3"
            >
              <img
                id="livestream3"
                src="https://live.heatsynclabs.org/snapshot.php?camera=3"
                width="320"
                height="240"
              />
            </a>
          </div>

          <div className="caption">
            <a
              id="lsAnchor4"
              href="https://live.heatsynclabs.org/snapshot.php?camera=4"
            >
              <img
                id="livestream4"
                src="https://live.heatsynclabs.org/snapshot.php?camera=4"
                width="320"
                height="240"
              />
            </a>
          </div>
          <ul>
            <li>
              doors currently:
              <span id="door_status">
                <i className="icon-spinner icon-spin"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
