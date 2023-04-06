export default function DonationPage() {
  return (
    <div className="container">
      <div className="donation">
        <h3>Support us!</h3>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="7596RGJWUWZZ4" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
            border="0"
            name="submit"
            alt="Donate to HeatSync Labs"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </div>
    </div>
  );
}
