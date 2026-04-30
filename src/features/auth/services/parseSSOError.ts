export const parseSSOError = (err: any, fallback = 'OAuth failed') => {
  const clerk = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message;
  const authSession = err?.message || err?.error || err?.code;
  const google = err?.params?.error_description || err?.params?.error;
  return clerk || google || authSession || fallback;
};
