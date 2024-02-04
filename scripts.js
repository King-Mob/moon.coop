const obfuscatedUser = "e1.pnuhgolj^";
const obfuscatedPassword = 'On<iK5]dI0c4WqrsI"x(o5-LE48;ju';

const unobfuscator = (obfuscated) => {
  return obfuscated
    .split("")
    .map((char, index) => (index % 2 === 0 ? char : ""))
    .reverse()
    .join("");
};

const processCalendar = (calendar) => {
  const findProperty = (event, property) => {
    const propertyCollection = event[1].find(
      (attribute) => attribute[0] === property
    );

    return propertyCollection ? propertyCollection[3] : null;
  };

  return calendar[2]
    .filter((item) => item[0] === "vevent")
    .map((event) => ({
      created: findProperty(event, "created"),
      start: findProperty(event, "dtstart"),
      end: findProperty(event, "dtend"),
      summary: findProperty(event, "summary"),
      location: findProperty(event, "location"),
    }));
};

const formatEvent = (event) => {
  return event.start.replace("T", " ").slice(0, 16) + "\n" + event.summary;
};

const start = async () => {
  const calendarResponse = await fetch(
    "https://cloud.ldn.cash/remote.php/dav/calendars/john.e/moon_shared_by_szczepan/?export&accept=jcal",
    {
      headers: {
        Authorization: `Basic ${btoa(
          unobfuscator(obfuscatedUser) + ":" + unobfuscator(obfuscatedPassword)
        )}`,
      },
    }
  );
  const calendar = await calendarResponse.json();

  const events = processCalendar(calendar);

  const upcomingEvents = events
    .filter((event) => Date.now() < new Date(event.start))
    .sort((eventA, eventB) => new Date(eventA.start) - new Date(eventB.start));

  console.log(upcomingEvents);

  const dateDisplay = document.getElementById("meeting-date");

  const dateText = formatEvent(upcomingEvents[0]);

  dateDisplay.innerHTML = dateText;
};

const toggleMore = () => {
  const moreMeetings = document.getElementById("more-meetings");

  //if it's hidden, display it, if it's displayed, hide it.
};

start();
