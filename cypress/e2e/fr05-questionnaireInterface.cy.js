describe("FR_05 - Questionnaire Interface", () => {
  it("should load questions and retain selected answers", () => {

    cy.visit("http://localhost:3000/questionnaire");

    // Recipient Information loaded
    cy.contains("Recipient Information").should("be.visible");

    // Occasion
    cy.contains("Birthday").click();

    // Relationship
    cy.contains("Friend").click();

    // Gender
    cy.contains("Male").click();

    // Age Type
    cy.contains("Adult").click();

    // Age Group
    cy.get("select").select("20–25");

    // Known Duration
    cy.contains("1–3 year").click();

    // Next button enabled
    cy.contains("button", "Next").should("not.be.disabled");

    // Go to next step
    cy.contains("button", "Next").click();

    // Gift count page loaded
    cy.contains("Number of gifts").should("be.visible");

    // Go back
    cy.contains("button", "Back").click();

    // Verify responses still exist
    cy.contains("Recipient Information").should("be.visible");

    cy.contains("Birthday")
      .parent()
      .find("input")
      .should("be.checked");

  });
});