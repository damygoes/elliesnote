export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export const toDateString = (date: Date = new Date()) =>
  date.toISOString().slice(0, 10);
