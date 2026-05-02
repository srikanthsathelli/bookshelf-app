import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  readonly pageTitle: Locator;
  readonly counter: Locator;
  readonly titleInput: Locator;
  readonly authorInput: Locator;
  readonly statusSelect: Locator;
  readonly addButton: Locator;
  readonly errorMessage: Locator;
  readonly bookList: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByTestId('page-title');
    this.counter = page.getByTestId('counter');
    this.titleInput = page.getByTestId('title-input');
    this.authorInput = page.getByTestId('author-input');
    this.statusSelect = page.getByTestId('status-select');
    this.addButton = page.getByTestId('add-btn');
    this.errorMessage = page.getByTestId('error-message');
    this.bookList = page.getByTestId('book-list');
    this.emptyState = page.getByTestId('empty-state');
  }

  async open() {
    await this.page.goto('/');
  }

  async addBook(title: string, author: string, status?: string) {
    await this.titleInput.fill(title);
    await this.authorInput.fill(author);

    if (status) {
      await this.statusSelect.selectOption(status);
    }

    await this.addButton.click();
  }

  getBookByTitle(title: string) {
    return this.page
      .getByTestId('book-item')
      .filter({ hasText: title });
  }

  getBookStatus(title: string) {
    return this.getBookByTitle(title)
      .getByTestId('book-status');
  }

  async clickNextStatusButton(title: string) {
    await this.getBookByTitle(title)
      .getByTestId('status-btn')
      .click();
  }
}