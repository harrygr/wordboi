export const config = {
  stathatKey: process.env.STATHAT_KEY,
  env: process.env.NODE_ENV,
  umamiSiteId: process.env.NEXT_PUBLIC_UMAMI_SITE_ID,
};

export const gameConfig = {
  firstDay: new Date(2022, 3, 1),
  maxGuesses: 6,
};
