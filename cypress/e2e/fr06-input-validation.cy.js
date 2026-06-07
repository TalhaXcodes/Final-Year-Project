describe("FR_06 - Input Validation", () => {
  it("should prevent proceeding when required fields are empty", () => {
    cy.visit("http://localhost:3000/questionnaire");

    cy.contains("Recipient Information").should("be.visible");

    cy.contains("Please fill all required fields before proceeding")
      .should("be.visible");

    cy.contains("button", "Next")
      .should("be.disabled");
  });

  it("should allow proceeding when all required fields are filled", () => {
    cy.visit("http://localhost:3000/questionnaire");

    cy.contains("Birthday").click();
    cy.contains("Friend").click();
    cy.contains("Male").click();
    cy.contains("Adult").click();

    cy.get("select").select("20–25");

    cy.contains("1–3 year").click();

    cy.contains("button", "Next")
      .should("not.be.disabled")
      .click();

    cy.contains("Number of gifts").should("be.visible");
  });
});