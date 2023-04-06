import "./FsCalendarPage.css";

export default function FsCalendarPage() {
  return (
    <div className="fscalendar">
      <div id="wrapper">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc%40group.calendar.google.com&ctz=America%2FPhoenix"
          frameborder="0"
          scrolling="no"
          width="100%"
          height="100%"
          title="calendar entries"
        ></iframe>
      </div>
    </div>
  );
}
