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
  const localTime = new Date(event.start);

  return `${event.summary}\n
  ${localTime.toLocaleDateString()} 
  ${localTime.toLocaleTimeString().slice(0, 5)}`;
};

const start = async () => {
  const today = new Date(Date.now());
  const oneYearLater = new Date(Date.now()).setFullYear(
    today.getFullYear() + 1
  );
  const startDate = Math.floor(today / 1000);
  const endDate = Math.floor(oneYearLater / 1000);

  const calendarResponse = await fetch(
    `https://cloud.ldn.cash/remote.php/dav/calendars/john.e/moon_shared_by_szczepan/?export&accept=jcal&expand=1&start=${startDate}&end=${endDate}`,
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

  const upcomingEvents = events.sort(
    (eventA, eventB) => new Date(eventA.start) - new Date(eventB.start)
  );

  const dateDisplay = document.getElementById("meeting-date");
  const dateText = formatEvent(upcomingEvents[0]);
  dateDisplay.innerHTML = dateText;

  const moreMeetings = document.getElementById("more-meetings");
  upcomingEvents
    .slice(1)
    .map((event) => formatEvent(event))
    .forEach((eventText) => {
      const eventLine = document.createElement("p");
      eventLine.innerHTML = eventText;
      moreMeetings.append(eventLine);
    });
};

const toggleMore = () => {
  console.log("hello");

  const moreMeetings = document.getElementById("more-meetings");
  const seeMore = document.getElementById("see-more");

  if (moreMeetings.style.display === "block") {
    moreMeetings.style.display = "none";
    seeMore.innerHTML = "more";
  } else {
    moreMeetings.style.display = "block";
    seeMore.innerHTML = "less";
  }
};

document.getElementById("see-more").addEventListener("click", (e) => {
  toggleMore();
});

start();
