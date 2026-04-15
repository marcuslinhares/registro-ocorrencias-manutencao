import { test, expect } from '@playwright/test';

test.describe('Incidents Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the dashboard title', async ({ page }) => {
    await expect(page.getByText('Ordens de Serviço')).toBeVisible();
  });

  test('should display the incident table', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(page.getByText('Equipamento')).toBeVisible();
  });

  test('should create a new incident successfully', async ({ page }) => {
    // Open modal
    await page.click('button:has-text("Nova Ordem de Serviço")');
    
    const modal = page.getByRole('dialog');
    
    // Fill form
    const uniqueReason = `E2E Test - ${Date.now()}`;
    await modal.locator('input[placeholder="Digite o motivo..."]').fill(uniqueReason);
    await modal.locator('textarea[placeholder="Descreva detalhadamente o serviço..."]').fill('Description for E2E frontend registration test.');
    
    // Select machine
    await modal.getByText('Selecione a máquina...').click();
    await page.getByRole('option', { name: 'Torno CNC' }).click();
    
    // Select type
    await modal.getByText('Selecione o tipo...').click();
    await page.getByRole('option', { name: 'Preventiva' }).click();

    // Select severity
    await modal.getByText('Selecione a gravidade...').click();
    await page.getByRole('option', { name: 'Média' }).click();
    
    // Submit form
    await modal.locator('button:has-text("Criar Ordem de Serviço")').click();
    
    // Verify success toast - Increase timeout for backend/network processing
    await expect(page.getByText('Sucesso!').first()).toBeVisible({ timeout: 15000 });
    
    // Wait for modal to close
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    
    // Verify it appeared in the table - Increase timeout for refetch
    await expect(page.getByText(uniqueReason)).toBeVisible({ timeout: 15000 });
  });
});
