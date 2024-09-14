# Electron Playwright Example on GitHub Actions Workflow for CI/CD & E2E Testing
[![CI/CD for each push](https://github.com/Van-QA/electron-playwright-test/actions/workflows/ci.yml/badge.svg)](https://github.com/Van-QA/electron-playwright-test/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Van-QA/electron-playwright-test/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Van-QA/electron-playwright-test/actions/workflows/codeql-analysis.yml)

A Playwright E2E Testing Sample with GitHub Actions Workflow for Electron App

This is a minimal Playwright E2E-testing sample for Electron application based on the [electron-quick-start
](https://github.com/electron/electron-quick-start) with [Quick Start Guide](https://electronjs.org/docs/latest/tutorial/quick-start) within the Electron documentation and [ElectronApplication | Playwright](https://playwright.dev/docs/api/class-electronapplication/) within the Playwright documentation.

Support workflow that trigger Playwright for Electron app based on GitHub Actions.

## Usage

```bash
# Install dependencies
yarn

# Run the test
yarn test

# Start the app normally
yarn start

```

## GitHub Actions Workflow

View source code:
https://github.com/Van-QA/electron-playwright-test/blob/master/.github/workflows/ci.yml