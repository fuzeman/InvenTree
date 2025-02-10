import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI
    ? [
        {
          command: 'yarn run dev',
          url: 'http://localhost:5173',
          reuseExistingServer: !process.env.CI,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 120 * 1000
        },
        {
          command: 'invoke dev.gunicorn -a 127.0.0.1:8100',
          env: {
            INVENTREE_DEBUG: 'True',
            INVENTREE_LOG_LEVEL: 'DEBUG',
            INVENTREE_PLUGINS_ENABLED: 'True',
            INVENTREE_ADMIN_URL: 'test-admin',
            INVENTREE_SITE_URL: 'http://localhost:8000',
            INVENTREE_CORS_ORIGIN_ALLOW_ALL: 'False',
            INVENTREE_CORS_ORIGIN_WHITELIST:
              'http://localhost:8000,http://localhost:5173',
            INVENTREE_COOKIE_SAMESITE: 'Lax'
          },
          url: 'http://127.0.0.1:8100/api/',
          reuseExistingServer: !process.env.CI,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 120 * 1000
        },
        {
          command:
            'caddy run --config ../../contrib/test/Caddyfile --adapter caddyfile',
          env: {
            INVENTREE_SERVER: 'http://127.0.0.1:8100',
            INVENTREE_SITE_URL: 'http://localhost:8000'
          },
          url: 'http://127.0.0.1:8000/api/',
          reuseExistingServer: !process.env.CI,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 120 * 1000
        }
      ]
    : [
        {
          command: 'yarn run dev',
          url: 'http://localhost:5173',
          reuseExistingServer: !process.env.CI,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 120 * 1000
        },
        {
          command: 'invoke dev.server -a 127.0.0.1:8000',
          env: {
            INVENTREE_DEBUG: 'True',
            INVENTREE_LOG_LEVEL: 'DEBUG',
            INVENTREE_PLUGINS_ENABLED: 'True',
            INVENTREE_ADMIN_URL: 'test-admin',
            INVENTREE_SITE_URL: 'http://localhost:8000',
            INVENTREE_CORS_ORIGIN_ALLOW_ALL: 'True',
            INVENTREE_COOKIE_SAMESITE: 'Lax'
          },
          url: 'http://127.0.0.1:8000/api/',
          reuseExistingServer: !process.env.CI,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 120 * 1000
        }
      ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  }
});
