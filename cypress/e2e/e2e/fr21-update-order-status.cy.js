describe("FR_21 - Update Order Status", () => {
  it("should allow admin to update order status", () => {
    cy.visit("http://localhost:3000/admin");

    cy.contains("button", "Orders").click();

    cy.contains("Orders Management", { timeout: 10000 }).should("be.visible");

    cy.get("select").first().then(($select) => {
      const currentStatus = $select.val();
      const newStatus =
        currentStatus === "shipped" ? "confirmed" : "shipped";

      cy.wrap($select).select(newStatus);

      cy.wait(2000);

      cy.get("select").first().should("have.value", newStatus);
    });
  });
});