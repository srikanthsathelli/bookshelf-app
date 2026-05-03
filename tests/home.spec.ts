import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/Homepage';

test.describe('BookShelf - Home Page', () => {
  
  let home: HomePage;
  
  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
  });
  
  test('displays the correct page title', async () => {
    await expect(home.pageTitle).toHaveText('📚 BookShelf');
  });
  
  test('user can add a new book', async () => {
    await home.addBook('The Great Gatsby', 'F. Scott Fitzgerald');
    const bookTitle = home.bookList.getByTestId('book-title');
    await expect(bookTitle).toHaveText('The Great Gatsby');
  });

test('user can change book status', async () => {
  await home.addBook('abc', 'hello');
  await home.clickNextStatusButton('abc');
  await expect(home.getBookStatus('abc')).toHaveText('Reading');
});
});