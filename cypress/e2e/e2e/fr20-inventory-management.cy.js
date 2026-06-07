describe("FR_20 - Inventory Management", () => {
  it("should allow admin to update product stock level", () => {
    cy.visit("http://localhost:3000/admin");

    cy.contains("BASKETRIES Admin Panel").should("be.visible");
    cy.contains("Product List", { timeout: 10000 }).should("be.visible");

    cy.contains("button", "Edit").first().click();

    cy.contains("Update Catalogue Product").should("be.visible");

    cy.get('input[name="stock"]')
      .clear()
      .type("15")
      .should("have.value", "15");

    cy.contains("button", "Update Product").click();

    cy.contains("Product updated successfully.", { timeout: 10000 })
      .should("be.visible");

    cy.contains("Product List").should("be.visible");
    cy.contains("td", "15").should("be.visible");
  });
});