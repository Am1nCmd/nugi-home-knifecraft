const puppeteer = require('puppeteer');

async function launchBrowser() {
  console.log('Launching browser...');

  // Launch browser with headless: false so user can interact with it
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000/admin/login');

  console.log('Browser is open and ready for manual interaction!');
  console.log('Please login manually with your Google account.');
  console.log('Once logged in, you can run authenticated tests using this browser session.');
  console.log('');
  console.log('To keep this session alive, this script will wait indefinitely...');
  console.log('Press Ctrl+C to close the browser when done.');

  // Keep the script running so browser stays open
  process.on('SIGINT', async () => {
    console.log('\nClosing browser...');
    await browser.close();
    process.exit(0);
  });

  // Keep the script alive
  setInterval(() => {
    // Do nothing, just keep the process alive
  }, 1000);
}

launchBrowser().catch(console.error);