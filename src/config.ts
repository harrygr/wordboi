export const config = {
  env: import.meta.env.MODE,
  umamiSiteId: import.meta.env.VITE_UMAMI_SITE_ID as string | undefined,
  umamiScriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL as string | undefined,
};

export const gameConfig = {
  firstDay: new Date(2022, 3, 1),
  maxGuesses: 6,
};
