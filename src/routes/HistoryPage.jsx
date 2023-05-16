import "./HistoryPage.css";

export default function HistoryPage() {
  //     ALL CREDIT FOR THE SCROLLING TEXT GOES TO
  //     Craig Buckler
  //     http://www.sitepoint.com/css3-starwars-scrolling-text/

  // Blame me for the music via embedded video bit
  return (
    <div className="history">
      <div className="wrapper">
        <div className="inner">
          <object width="420" height="315">
            <param
              name="movie"
              value="https://www.youtube.com/v/EjMNNpIksaI?version=3&amp;hl=en_US&autoplay=1&amp;autohide=2"
            ></param>
            <param name="allowFullScreen" value="true"></param>
            <param name="allowscriptaccess" value="always"></param>
            <embed
              src="https://www.youtube.com/v/EjMNNpIksaI?version=3&amp;hl=en_US&autoplay=1&amp;autohide=2"
              type="application/x-shockwave-flash"
              width="420"
              height="315"
              allowscriptaccess="always"
              allowfullscreen="true"
            ></embed>
          </object>
        </div>
      </div>
      <p id="start">
        A short time ago in a hackerpsace very, very close&hellip;
      </p>
      <h1>HeatSync</h1>
      <div id="titles">
        <div id="titlecontent">
          <p className="center">
            EPISODE I<br />
            The Lab
          </p>

          <p>
            It is a period of financial calamity. Companies filing bankruptcy,
            and broken financial systems have struck fear in the average
            American. During the collapse, young heroes managed to establish
            Heat Sync Labs to battle the ultimate scourge: the lack of access to
            tools and knowledge to build the future of the world. A lab with the
            power to change the world.
          </p>
          <p>
            Haunted by visions of new ideas and a bright future, members of the
            lab have become custodians the new American Dream that can save our
            education, build new technology and freedom from drudgery...
          </p>
        </div>
      </div>
    </div>
  );
}
