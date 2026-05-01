const now = new Date();

const date = now.toLocaleDateString("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const time = now.toLocaleTimeString("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const tz = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  timeZoneName: "short",
})
  .formatToParts(now)
  .find(part => part.type === "timeZoneName")?.value;

return {
  date,
  time: `${time} ${tz}`,
};