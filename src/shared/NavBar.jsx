import "./NavBar.css";

export default function NavBar() {
  return (
    <nav>
      <div className="logo">
        <a href="/">
          <img
            src="img/heatsync-labs-logo__white.png"
            title="HeatSync Labs"
            alt="HeatSync Labs"
          />
        </a>
      </div>
      <input id="menu-toggle" type="checkbox" />
      <label className="menu-button-container" for="menu-toggle">
        <div className="menu-button"></div>
      </label>
      <ul className="menu">
        <li>
          <a href="classes" title="Classes">
            Classes
          </a>
        </li>
        <li>
          <a
            href="https://members.heatsynclabs.org/"
            rel="noreferrer"
            title="Member Site"
            target="_blank"
          >
            Membership
          </a>
        </li>
        <li>
          <a
            href="https://wiki.heatsynclabs.org/wiki/Main_Page"
            rel="noreferrer"
            title="Wiki"
            target="_blank"
          >
            Wiki
          </a>
        </li>
        <li>
          <a
            href="https://groups.google.com/forum/?fromgroups#!forum/heatsynclabs"
            alt="HSL Google Group"
            target="_blank"
            rel="noreferrer"
          >
            Discussion Group
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/HeatSyncLabs/"
            rel="noreferrer"
            title="Facebook Group"
            alt="Facebook Group"
            className="social-logo"
            target="_blank"
          >
            <i className="fa-2x fa-brands fa-square-facebook"></i>
          </a>
          <a
            href="http://bit.ly/hslslack"
            rel="noreferrer"
            title="Slack"
            alt="Slack"
            className="social-logo"
            target="_blank"
          >
            <i className="fa-2x fa-brands fa-slack"></i>
          </a>
          <a
            href="https://www.twitter.com/heatsynclabs"
            rel="noreferrer"
            title="Twitter"
            alt="Twitter"
            className="social-logo"
            target="_blank"
          >
            <i className="fa-2x fa-brands fa-square-twitter"></i>
          </a>
          <a
            href="https://www.github.com/heatsynclabs"
            rel="noreferrer"
            title="Github"
            alt="Github"
            className="social-logo"
            target="_blank"
          >
            <i className="fa-2x fa-brands fa-square-github"></i>
          </a>
          <a
            href="https://www.flickr.com/photos/hslphotosync/"
            rel="noreferrer"
            title="HSL PhotoSync"
            alt="HSL PhotoSync"
            className="social-logo"
            target="_blank"
          >
            <i className="fa-2x fa-brands fa-flickr"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}
