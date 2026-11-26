const _workshopErr = {
  validationError: "WORKSHOP_VALIDATION_ERROR",
  invalidTime: "INVALID_WORKSHOP_TIME",
  invalidTimeRange: "INVALID_WORKSHOP_TIME_RANGE",
  positiveInteger: "POSITIVE_INTEGER_ERROR",
  requiredFields: "REQUIRED_FIELDS",
  invalidId: "INVALID_WORKSHOP_ID",
  notFound: "WORKSHOP_NOT_FOUND",
  seatLimitExceeded: "SEAT_LIMIT_BELOW_BOOKED",
  hasBookings: "WORKSHOP_HAS_BOOKINGS",
  requiredTitle: "WORKSHOP_TITLE_REQUIRED",
  requiredLocation: "WORKSHOP_LOCATION_REQUIRED",
  pastDate: "WORKSHOP_DATE_IN_PAST",
};

export const workshopErrorCodes = Object.freeze(_workshopErr);