import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: '../',
  e2e: {
    video: false,
    supportFile: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {},
  },
});
