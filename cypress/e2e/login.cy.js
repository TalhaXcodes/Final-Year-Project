describe("Login Page", () => {
  it("shows validation on empty submit", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("button[type='submit']").click();

    cy.contains("Please fill in all fields").should("be.visible");
  });
});