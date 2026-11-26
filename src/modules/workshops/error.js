const _workshopErr = {
  validationError: "WORKSHOP_VALIDATION_ERROR",
  invalidDate: "INVALID_WORKSHOP_DATE",
  invalidTime: "INVALID_WORKSHOP_TIME",
  pastDate: "WORKSHOP_DATE_IN_PAST",
  invalidTimeRange: "INVALID_WORKSHOP_TIME_RANGE",
  positiveInteger: "POSITIVE_INTEGER_ERROR",
  invalidFees: "INVALID_FEES",
  requiredFields: "REQUIRED_FIELDS",
  invalidId: "INVALID_WORKSHOP_ID",
  notFound: "WORKSHOP_NOT_FOUND",
  seatLimitExceeded: "SEAT_LIMIT_BELOW_BOOKED",
  hasBookings: "WORKSHOP_HAS_BOOKINGS",
  requiredTitle: "WORKSHOP_TITLE_REQUIRED",
  requiredLocation: "WORKSHOP_LOCATION_REQUIRED",
  pastDate: "WORKSHOP_DATE_IN_PAST",
  invalidTimeRange: "INVALID_TIME_RANGE",
};

export const workshopErrorCodes = Object.freeze(_workshopErr);