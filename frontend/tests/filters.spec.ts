import { test, expect } from '@playwright/test';

test.describe('Incidents Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should filter by occurrence type', async ({ page }) => {
    // 1. Create a "Corretiva" incident
    const corretivaReason = `Corretiva Test ${Date.now()}`;
    await page.click('button:has-text("Nova Ordem de Serviço")');
    const modal = page.getByRole('dialog');
    await modal.locator('input[placeholder="Digite o motivo..."]').fill(corretivaReason);
    await modal.locator('textarea[placeholder="Descreva detalhadamente o problema e o serviço que será realizado..."]').fill('Description for corretiva incident test.');
    await modal.getByText('Selecione a máquina...').click();
    await page.getByRole('option', { name: 'Torno CNC' }).click();
    await modal.getByText('Selecione o tipo...').click();
    await page.getByRole('option', { name: 'Corretiva' }).click();
    await modal.getByText('Selecione a gravidade...').click();
    await page.getByRole('option', { name: 'Alta' }).click();
    await modal.locator('button:has-text("Criar Ordem de Serviço")').click();
    await expect(page.getByText(corretivaReason)).toBeVisible({ timeout: 15000 });

    // 2. Create a "Preventiva" incident
    const preventivaReason = `Preventiva Test ${Date.now()}`;
    await page.click('button:has-text("Nova Ordem de Serviço")');
    await modal.locator('input[placeholder="Digite o motivo..."]').fill(preventivaReason);
    await modal.locator('textarea[placeholder="Descreva detalhadamente o problema e o serviço que será realizado..."]').fill('Description for preventiva incident test.');
    await modal.getByText('Selecione a máquina...').click();
    await page.getByRole('option', { name: 'Prensa' }).click();
    await modal.getByText('Selecione o tipo...').click();
    await page.getByRole('option', { name: 'Preventiva' }).click();
    await modal.getByText('Selecione a gravidade...').click();
    await page.getByRole('option', { name: 'Baixa' }).click();
    await modal.locator('button:has-text("Criar Ordem de Serviço")').click();
    await expect(page.getByText(preventivaReason)).toBeVisible({ timeout: 15000 });

    // 3. Apply "Corretiva" filter
    await page.click('button:has-text("Corretiva")');
    await expect(page.getByText(corretivaReason)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(preventivaReason)).not.toBeVisible();

    // 4. Toggle "Corretiva" filter off
    await page.click('button:has-text("Corretiva")');
    await expect(page.getByText(corretivaReason)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(preventivaReason)).toBeVisible();
  });

  test('should filter by search input', async ({ page }) => {
    const searchTerms = `UniqueSearchTerm-${Date.now()}`;
    
    // Create incident with unique term
    await page.click('button:has-text("Nova Ordem de Serviço")');
    const modal = page.getByRole('dialog');
    await modal.locator('input[placeholder="Digite o motivo..."]').fill(`Incident ${searchTerms}`);
    await modal.locator('textarea[placeholder="Descreva detalhadamente o problema e o serviço que será realizado..."]').fill('Some description here.');
    await modal.getByText('Selecione a máquina...').click();
    await page.getByRole('option', { name: 'Fresadora' }).click();
    await modal.getByText('Selecione o tipo...').click();
    await page.getByRole('option', { name: 'Planejada' }).click();
    await modal.getByText('Selecione a gravidade...').click();
    await page.getByRole('option', { name: 'Média' }).click();
    await modal.locator('button:has-text("Criar Ordem de Serviço")').click();
    
    await expect(page.getByText(`Incident ${searchTerms}`)).toBeVisible({ timeout: 15000 });

    // Search for the unique term
    await page.fill('input[placeholder="Buscar por equipamento, código ou motivo..."]', searchTerms);
    
    // Check results (wait for debounce)
    await expect(page.getByText(`Incident ${searchTerms}`)).toBeVisible({ timeout: 10000 });
    
    // Search for something that doesn't exist
    await page.fill('input[placeholder="Buscar por equipamento, código ou motivo..."]', 'NonExistentTermXYZ');
    await expect(page.getByText('Nenhuma ocorrência encontrada.')).toBeVisible({ timeout: 10000 });
  });
});
