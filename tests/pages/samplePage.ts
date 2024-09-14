import { Page } from '@playwright/test'
import { BasePage } from './basePage'
import { CommonActions } from './commonActions'

export class SamplePage extends BasePage {
  readonly menuId: string = 'Sample'
  static readonly containerId: string = 'sample-container-test-id'

  constructor(
    public page: Page,
    readonly action: CommonActions
  ) {
    super(page, action, SamplePage.containerId)
  }
}
