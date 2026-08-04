import { test, expect } from '@playwright/test';

test.describe('Add Programming Question E2E Flow', () => {

  test('User can log in, open the modal, and save a problem', async ({ page }) => {
    // 1. Navigate to the local frontend
    await page.goto('http://localhost:5173');

    // 2. Login based on your LoginPage.jsx placeholders[cite: 6]
    // The screenshot shows demo@gmail.com logged in
    await page.getByPlaceholder('you@example.com').fill('demo@gmail.com'); 
    await page.getByPlaceholder('••••••••').fill('12345'); 
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 3. Wait for Dashboard to load and verify the "My Problems" tab is visible[cite: 5]
    await page.waitForURL('**/app');
    await expect(page.getByText('My Problems')).toBeVisible();

    // 4. Click the wide '+ Add Problem' button at the bottom of the screen
    // getByRole targets the exact text of the button
    await page.getByRole('button', { name: 'Add Problem' }).click();

    // 5. Wait for the "Add New Problem" modal to appear
    await expect(page.getByText('Add New Problem')).toBeVisible();

    // 6. Fill out the Modal fields matching your specific placeholders
    // Question Title
    await page.getByPlaceholder('e.g., Two Sum').fill('Automated Test Question');

    // Select a Category 
    // This looks for the <select> element that currently shows "Select Category" and changes it to the first actual option
    await page.locator('select').filter({ hasText: 'Select Category' }).selectOption({ index: 1 });

    // Fill the Description
    // We target the first textarea on the page since there's no unique placeholder for it
    await page.locator('textarea').first().fill('This description was typed automatically by Playwright.');

    // Fill the Solution Code using its exact placeholder
    await page.getByPlaceholder('Paste solution code here...').fill('console.log("Playwright works!");');

    // 7. Click the "Save Problem" button
    await page.getByRole('button', { name: 'Save Problem' }).click();

    // 8. Verify the new question successfully renders in the problem list[cite: 5]
    await expect(page.getByText('Automated Test Question')).toBeVisible({ timeout: 10000 });
  });
  
});