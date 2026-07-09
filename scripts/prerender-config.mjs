export const DEFAULT_PUPPETEER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
];

export const getPuppeteerLaunchOptions = (env = process.env) => {
  const executablePath = env.PUPPETEER_EXECUTABLE_PATH?.trim();

  return {
    headless: "new",
    args: DEFAULT_PUPPETEER_ARGS,
    ...(executablePath ? { executablePath } : {}),
  };
};
