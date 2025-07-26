export const convertTimestampToDateTime = (timestamp) => {
  return getCorrectISOString(timestamp);
};

const getCorrectISOString = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours().toString().padStart(2, "0");
  const originISOString = date.toISOString();

  const isoString = `${originISOString.slice(
    0,
    10
  )}T${hour}${originISOString.slice(13)}`;

  return isoString;
};
