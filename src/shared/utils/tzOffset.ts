/** Returns the user's UTC offset in minutes (positive = ahead of UTC). */
export const getTzOffsetMinutes = (): number => new Date().getTimezoneOffset();
