describe("FR_02 - Login", () => {
  it("should login successfully and redirect to dashboard", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]')
      .clear()
      .type("tshahbaz36@gmail.com");

    cy.get('input[name="password"]')
      .clear()
      .type("talhas5951", {
        parseSpecialCharSequences: false,
      });

    cy.wait(1000);

    cy.get("form").within(() => {
      cy.get('button[type="submit"]')
        .should("be.visible")
        .click({ force: true });
    });

    cy.wait(3000);

    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });
});