const obfuscatedKey = "c5308ca29818nsja8f5a1p577a89107e191c1hsm24771a63f6";

const getMoonData = async () => {
  const options = {
    headers: {
      "X-RapidAPI-Key": obfuscatedKey.split("").reverse().join(""),
      "X-RapidAPI-Host": "moon-phase.p.rapidapi.com",
    },
  };

  const response = await fetch(
    "https://moon-phase.p.rapidapi.com/advanced",
    options
  );
  const moonData = await response.json();

  return moonData;
};

const getSunday = (fullMoon) => {
  const sundayDate = new Date(fullMoon);
  if (sundayDate.getDay() !== 0) {
    const daysToGo = 7 - fullMoon.getDay();
    sundayDate.setDate(fullMoon.getDate() + daysToGo);
  }

  return sundayDate;
};

const calculateMeeting = async (moonData) => {
  const currentFullMoon = new Date(
    moonData.moon_phases.full_moon.current.timestamp * 1000
  );
  const nextFullMoon = new Date(
    moonData.moon_phases.full_moon.next.timestamp * 1000
  );

  const today = new Date();

  const sundayAfterCurrent = getSunday(currentFullMoon);
  const sundayAfterNext = getSunday(nextFullMoon);

  const dateDisplay = document.getElementById("meeting-date");

  if (today.valueOf() < sundayAfterCurrent.valueOf()) {
    const dateText = sundayAfterCurrent.toString().slice(0, 10);
    dateDisplay.innerHTML = dateText;
    return;
  } else {
    const dateText = sundayAfterNext.toString().slice(0, 10);
    dateDisplay.innerHTML = dateText;
    return;
  }
};

const start = async () => {
  const localMoonStorage = localStorage.getItem("moonData");

  if (localMoonStorage) {
    const localMoonData = JSON.parse(localMoonStorage);

    if (
      Date.now() <
      localMoonData.moon_phases.full_moon.next.timestamp * 1000
    ) {
      calculateMeeting(localMoonData);
    } else {
      const moonData = await getMoonData();
      calculateMeeting(moonData);
      localStorage.setItem("moonData", JSON.stringify(moonData));
    }
  } else {
    const moonData = await getMoonData();
    calculateMeeting(moonData);
    localStorage.setItem("moonData", JSON.stringify(moonData));
  }
};

start();
