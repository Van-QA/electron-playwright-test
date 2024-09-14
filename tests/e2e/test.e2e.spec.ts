import { expect } from '@playwright/test'
import { page, test, TIMEOUT } from '../config/fixtures'

test('window has correct title', async () => {
  const title = await page.title()
  expect(title).toBe('Hello World!')
})
