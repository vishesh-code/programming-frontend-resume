import { test, expect } from '@playwright/test';

test.describe('Add Programming Question E2E Flow', () => {
  const TEST_QUESTION_TITLE = `E2E Test Problem ${Date.now()}`;
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'; // Default or Render URL

  test('User can log in, add a new question, and see it in the list', async ({ page, request }) => {
    // 1. Open App Login
    await page.goto(BASE_URL);

    // 2. Perform Login (Uses your Login.jsx form state)[cite: 1]
    await page.fill('input[type="email"]', 'your_email@example.com');
    await page.fill('input[type="password"]', 'your_password');
    await page.click('button[type="submit"]');

    // 3. Wait for redirect to standard app landing page (/app)[cite: 1]
    await page.waitForURL('**/app');

    // 4. Click the Add Problem button in the FilterBar[cite: 1]
    // FilterBar triggers document.getElementById("add-modal")?.showModal()[cite: 1]
    await page.click('button:has-text("Add")'); 

    // 5. Fill out the AddProblemModal form inputs
    const modal = page.locator('#add-modal');
    await expect(modal).toBeVisible();

    await modal.locator('input[name="question"]').fill(TEST_QUESTION_TITLE);
    await modal.locator('textarea[name="description"]').fill('Test problem generated via automated Playwright run.');
    
    // Select category (Select first dynamic option if applicable)
    await modal.locator('select[name="category"]').selectOption({ index: 1 });
    await modal.locator('select[name="difficulty"]').selectOption('Easy');

    // 6. Save Problem
    await modal.locator('button[type="submit"]').click();

    // 7. Verify UI update
    // Landing.jsx re-fetches problems and renders ProblemsCard list[cite: 1]
    const createdCard = page.locator(`text=${TEST_QUESTION_TITLE}`);
    await expect(createdCard).toBeVisible({ timeout: 10000 });

    // --- CLEANUP ---
    // Extract token from localStorage to delete test data from same database[cite: 1]
    const token = await page.evaluate(() => localStorage.getItem('auth-token'));
    
    // Get problems list to retrieve created problem ID[cite: 1, 2]
    const response = await request.get(`${process.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/problems?tab=my_problems`, {
      headers: { 'auth-token': token },
    });
    
    const data = await response.json();
    const createdItem = data.problems.find(p => p.question === TEST_QUESTION_TITLE);

    if (createdItem && createdItem._id) {
      await request.delete(`${process.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/problems/${createdItem._id}`, {
        headers: { 'auth-token': token },
      });
    }
  });
});