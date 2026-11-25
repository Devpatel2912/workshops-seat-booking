
export const parseEventDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Invalid date. Use YYYY-MM-DD");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Invalid event date");
  }

  return date;
};

export const parseTime = (value) => {
  if (
    typeof value !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  ) {
    throw new Error("Invalid time. Use HH:mm");
  }

  return new Date(`1970-01-01T${value}:00.000Z`);
};

export const validateWorkshop = (data) => {
  const {
    title,
    eventDate,
    startTime,
    endTime,
    seatLimit,
    location,
    fees,
  } = data;

  if (
    !title?.trim() ||
    !eventDate ||
    !startTime ||
    !endTime ||
    !location?.trim() ||
    seatLimit === undefined ||
    fees === undefined
  ) {
    throw new Error("All workshop fields are required");
  }

  if (!Number.isInteger(seatLimit) || seatLimit <= 0) {
    throw new Error("Seat limit must be greater than zero");
  }

  if (!Number.isFinite(Number(fees)) || Number(fees) < 0) {
    throw new Error("Fees cannot be negative");
  }

  const date = parseEventDate(eventDate);
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (date < new Date(new Date().setUTCHours(0, 0, 0, 0))) {
    throw new Error("Event date cannot be in the past");
  }

  if (end <= start) {
    throw new Error("End time must be later than start time");
  }

  return { date, start, end };
};
