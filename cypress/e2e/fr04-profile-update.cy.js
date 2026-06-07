describe("FR_04 - View or Update Profile", () => {
  it("should update contact and shipping information", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]')
      .clear()
      .type("tshahbaz36@gmail.com");

    cy.get('input[name="password"]')
      .clear()
      .type("talhas5951", {
        parseSpecialCharSequences: false,
      });

    cy.get("form").within(() => {
      cy.get('button[type="submit"]')
        .should("be.visible")
        .click({ force: true });
    });

    cy.url({ timeout: 15000 }).should("include", "/dashboard");

    cy.visit("http://localhost:3000/profile");

    cy.contains("Personal Information", { timeout: 10000 })
      .should("be.visible");

    cy.get('input[placeholder="Your phone number"]')
      .clear()
      .type("03001234567");

    cy.contains("button", "Save Personal Information")
      .click({ force: true });

    cy.contains("Personal information saved successfully!", {
      timeout: 10000,
    }).should("be.visible");

    cy.wait(2000);

    cy.contains("Shipping Information").should("be.visible");

    cy.get('input[placeholder="Street address"]')
      .clear()
      .type("House 123, Test Street");

    cy.get('input[placeholder="City"]')
      .clear()
      .type("Lahore");

    cy.get('input[placeholder="Postal code"]')
      .clear()
      .type("54000");

    cy.get('input[placeholder="Country"]')
      .clear()
      .type("Pakistan");

    cy.contains("button", "Save Shipping Information")
      .click({ force: true });

    cy.contains("Shipping information saved successfully!", {
      timeout: 10000,
    }).should("be.visible");
  });
});