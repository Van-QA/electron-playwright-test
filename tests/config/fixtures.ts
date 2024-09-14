import {
  _electron as electron,
  BrowserContext,
  ElectronApplication,
  expect,
  Page,
  test as base,
} from '@playwright/test'
import {
  ElectronAppInfo,
  findLatestBuild,
  parseElectronApp,
  stubDialog,
} from 'electron-playwright-helpers'
import { Constants } from './constants'
import { SamplePage } from '../pages/samplePage'
import { CommonActions } from '../pages/commonActions'

export let electronApp: ElectronApplication
export let page: Page
export let appInfo: ElectronAppInfo
let context: BrowserContext
export const TIMEOUT = parseInt(process.env.TEST_TIMEOUT || Constants.TIMEOUT)
const TRACE_PATH = Constants.TRACE_DIR + 'trace.zip'

export async function setupElectron() {
  console.log(`TEST TIMEOUT: ${TIMEOUT}`)

  process.env.CI = 'e2e'

  // Support fetch different build per OS
  // const latestBuild = findLatestBuild('dist')
  // expect(latestBuild).toBeTruthy()
  //
  // // parse the packaged Electron app and find paths and other info
  // appInfo = parseElectronApp(latestBuild)
  // expect(appInfo).toBeTruthy()
  // electronApp = await electron.launch({
  //   args: [appInfo.main], // main file from package.json
  //   executablePath: appInfo.executable, // path to the Electron executable
  //   // recordVideo: { dir: Constants.VIDEO_DIR }, // Specify the directory for video recordings
  // })

  electronApp = await electron.launch({ args: ['./dist/main.js'] });

  // Handle msg box if any
  // await stubDialog(electronApp, 'showMessageBox', { response: 1 })

  page = await electronApp.firstWindow({timeout: TIMEOUT})
}

export async function teardownElectron() {
  await page.close()
  await electronApp.close()
}

/**
 * this fixture is needed to record and attach videos / screenshot on failed tests when
 * tests are run in serial mode (i.e. browser is not closed between tests)
 */
export const test = base.extend<
  {
    commonActions: CommonActions
    sammplePage: SamplePage
    attachVideoPage: Page
    attachScreenshotsToReport: void
  },
  { createVideoContext: BrowserContext }
>({
  commonActions: async ({ request }, use, testInfo) => {
    await use(new CommonActions(page, testInfo))
  },
  sammplePage: async ({ commonActions }, use) => {
    await use(new SamplePage(page, commonActions))
  },
  createVideoContext: [
    async ({ playwright }, use) => {
      const context = electronApp.context()
      await use(context)
    },
    { scope: 'worker' },
  ],

  attachVideoPage: [
    async ({ createVideoContext }, use, testInfo) => {
      await use(page)

      if (testInfo.status !== testInfo.expectedStatus) {
        const path = await createVideoContext.pages()[0].video()?.path()
        await createVideoContext.close()
        await testInfo.attach('video', {
          path: path,
        })
      }
    },
    { scope: 'test', auto: true },
  ],

  attachScreenshotsToReport: [
    async ({ commonActions }, use, testInfo) => {
      await use()

      // After the test, we can check whether the test passed or failed.
      if (testInfo.status !== testInfo.expectedStatus) {
        await commonActions.takeScreenshot('')
        await context.tracing.stopChunk({ path: TRACE_PATH })
        await testInfo.attach('trace', { path: TRACE_PATH })
      }
    },
    { auto: true },
  ],
})


test.beforeAll(async () => {
  test.setTimeout(TIMEOUT)
  await setupElectron()
  context = electronApp.context()
  await context.tracing.start({ screenshots: true, snapshots: true })
  page.on('close', async () => {
    await context.tracing.stop()
  })
  // Direct Electron console to Node terminal.
  page.on('console', console.log);
  await page.waitForSelector('img[alt="Logo"]', {
    state: 'visible',
    timeout: TIMEOUT,
  })
})

test.beforeEach(async () => {
  // start chunk before each test
  await context.tracing.startChunk()
})

test.afterAll(async () => {
  // temporally disabling this due to the config for parallel testing WIP
  // teardownElectron()
})
