describe("FR_19 - Admin Dashboard", () => {
  it("should display incoming orders in admin dashboard", () => {
    cy.visit("http://localhost:3000/admin");

    cy.contains("BASKETRIES Admin Panel").should("be.visible");

    cy.contains("button", "Orders").click();

    cy.contains("Orders Management", { timeout: 10000 }).should("be.visible");

    cy.contains(/Order ID|No orders placed yet/i).should("be.visible");

    cy.contains("Total Orders").should("be.visible");
  });
});