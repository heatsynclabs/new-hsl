export default function HomePage() {
  return (
    <>
      <div className="container main">
        <main>
          <div className="row">
            <div className="span3 sidebar-nav">
              <div className="left-info">
                <h3>We are:</h3>
                <ul>
                  <li>
                    A place where you can make things. We call it a hackerspace.
                    We are a grassroots co-op of volunteers&mdash; No staff.
                  </li>
                  <li>
                    Located at:
                    <br />
                    <a href="https://goo.gl/maps/5oo83">
                      108 West Main St.
                      <br />
                      Downtown Mesa
                    </a>
                  </li>
                  <li>
                    Open for everyone during public hours and events. Check our{" "}
                    <a
                      href="https://groups.google.com/forum/?fromgroups#!forum/heatsynclabs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      discussion group
                    </a>{" "}
                    for details and updates.
                  </li>
                  <li>
                    <strong>Hosting free public hours</strong>
                    <br />
                    Monday, Tuesday, Wednesday
                    <br />
                    7pm - 10pm
                    <br />
                    Saturday noon - 5pm
                  </li>
                  <li>
                    <strong>Our doors are currently:</strong>
                    <span id="door_status">
                      <i className="icon-spinner icon-spin"></i>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="donation">
                <h3>Support us!</h3>
                <form
                  action="https://www.paypal.com/cgi-bin/webscr"
                  method="post"
                  target="_top"
                >
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input
                    type="hidden"
                    name="hosted_button_id"
                    value="7596RGJWUWZZ4"
                  />
                  <button className="paypal-donate-img">
                    <img
                      type="image"
                      src="img/btn_donate_LG.gif"
                      border="0"
                      name="submit"
                      alt="Donate to HeatSync Labs"
                    />
                  </button>
                  <img
                    alt="spacer"
                    border="0"
                    src="img/pixel.gif"
                    width="1"
                    height="1"
                  />
                </form>
              </div>
            </div>
            <div className="span9">
              <div id="main_image">
                <div className="spinner">
                  <i className="icon-spinner icon-spin icon-3x"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div id="google-calendar" className="calendar-info">
              <h3 className="calendar-link">Calendar</h3>

              <div id="calendar-entries">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc%40group.calendar.google.com&ctz=America%2FPhoenix"
                  frameborder="0"
                  scrolling="no"
                  width="100%"
                  height="640"
                  title="calendar entries"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="connect-container">
            <div className="row">
              <div id="classes">
                <h3>Interested in Classes?</h3>
                <p>
                  <a href="register">Register</a> to get notifications on
                  classes you are interested in.
                </p>
                <p>
                  Check out <a href="classes">all our classes</a> to see what's
                  available.
                </p>
              </div>
            </div>
            <div className="row">
              <h3 className="hide-link">
                <a
                  href="https://groups.google.com/forum/?fromgroups#!forum/heatsynclabs"
                  alt="HSL Google Group"
                  target="_blank"
                  rel="noreferrer"
                  className="social-logo"
                >
                  <i className="fa-1x fa-fw fa-solid fa-user-group"></i>
                  Discussion Group
                </a>
              </h3>
              <h3 className="hide-link">
                <a
                  href="http://bit.ly/hslslack"
                  alt="Slack"
                  target="_blank"
                  rel="noreferrer"
                  className="social-logo"
                >
                  <i className="fa-1x fa-fw fa-brands fa-slack"></i>Slack
                  Channel
                </a>
              </h3>
            </div>
          </div>
        </main>
      </div>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="span12">
              <div className="row">
                <div className="span4">
                  <h3>Get Involved</h3>
                  <p>
                    HeatSync Labs is a community-driven 501(c)3 non-profit shop
                    and workspace where engineers, artists, students, and
                    hobbyists come to make prototypes, art, and other creative
                    projects.
                  </p>
                  <p>
                    It is a workshop for mad scientists, artists and anyone
                    creating or making! We make tools, resources, and skills
                    available to you.
                  </p>
                  <div className="btn btn-primary btn-large orange-button">
                    <a href="https://members.heatsynclabs.org/">
                      Members' site
                    </a>
                  </div>
                </div>
                <div className="span4">
                  <h3>Membership</h3>
                  <p>
                    You don't need to be a member to come and make stuff, but we
                    are member-supported and member-driven so your support is
                    appreciated! We encourage you to bring your projects during
                    public hours so you get a feel for the place first.
                  </p>
                  <p>
                    To learn more about how we work behind the scenes, check out
                    the
                    <a href="https://members.heatsynclabs.org/">
                      Members Website.
                    </a>
                  </p>
                  <div className="btn btn-primary btn-large orange-button">
                    <a href="https://members.heatsynclabs.org/users/sign_up">
                      Become a Supporting Member!
                    </a>
                  </div>
                </div>
                <div className="span4 hide-link camera-container">
                  <h3>
                    <a href="live">Live</a>
                  </h3>
                  <a href="live">
                    <img
                      src="https://live.heatsynclabs.org/snapshot.php?camera=1"
                      alt="live webcam"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
