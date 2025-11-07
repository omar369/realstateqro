import { test, expect } from "@playwright/test";

test.describe("Página de contacto", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contacto");
  });

  test("debe mostrar el formulario y enviar un mensaje correctamente", async ({ page }) => {
    // Verifica título
    await expect(page.getByRole("heading", { name: "Contacto" })).toBeVisible();

    // Llena los campos visibles
    await page.fill('input[name="nombre"]', "Juan Pérez");
    await page.fill('input[name="correo"]', "juan@example.com");
    await page.fill('textarea[name="mensaje"]', "Estoy interesado en una propiedad.");

    // Envía el formulario
    await page.click('button[type="submit"]');

    // Espera la respuesta de éxito
    await expect(page.getByText("Mensaje enviado correctamente.")).toBeVisible();
  });

  test("debe mostrar error si los campos están vacíos", async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.getByText("No se pudo enviar el mensaje")).toBeVisible();
  });
});

