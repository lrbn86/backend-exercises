import assert from 'node:assert/strict';

/*
 * Scenario: Book appointments for a doctor
 * Rules:
 * Cannot double book
 * Cannot book past dates
 */

interface Request {
  existing_appointments: Date[];
  requested_slot: Date;
};

interface Response {
  success: boolean;
  message: string;
};

const book = (req: Request): Response => {
  const {
    existing_appointments: dates,
    requested_slot,
  } = req;

  const exists = dates.some(date => date.getTime() === requested_slot.getTime());

  if (exists) {
    return {
      success: false,
      message: 'Time slot already booked',
    };
  }

  const lastAppt = dates[dates.length - 1];

  if (lastAppt && requested_slot.getTime() < lastAppt.getTime()) {
    return {
      success: false,
      message: 'Cannot book past dates',
    };
  }

  return {
    success: true,
    message: 'Request accepted',
  };
}

assert.deepEqual(
  book({
    existing_appointments: [new Date("2025-11-24T10:00"), new Date("2025-11-24T11:00")],
    requested_slot: new Date("2025-11-24T12:00"),
  }),
  {
    success: true,
    message: 'Request accepted',
  }
);

assert.deepEqual(
  book({
    existing_appointments: [new Date("2025-11-24T10:00"), new Date("2025-11-24T11:00")],
    requested_slot: new Date("2025-11-24T10:00"),
  }),
  {
    success: false,
    message: 'Time slot already booked',
  }
);

assert.deepEqual(
  book({
    existing_appointments: [new Date("2025-11-24T10:00"), new Date("2025-11-24T11:00")],
    requested_slot: new Date("2025-11-24T09:00"),
  }),
  {
    success: false,
    message: 'Cannot book past dates',
  }
);

assert.deepEqual(
  book({
    existing_appointments: [new Date("2025-11-24T10:00"), new Date("2025-11-24T11:00")],
    requested_slot: new Date("2025-11-22T00:00"),
  }),
  {
    success: false,
    message: 'Cannot book past dates',
  }
);
