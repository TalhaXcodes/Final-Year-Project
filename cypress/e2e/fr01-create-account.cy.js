describe("FR_01 - Create Account", () => {
  it("should create account with valid user details", () => {
    cy.visit("http://localhost:3000/signup");

    const email = `testuser${Date.now()}@gmail.com`;

    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type("Test@123456");
    cy.get('input[name="confirm"]').type("Test@123456");

    cy.contains("button", "Register").click();

    cy.contains(
      "Account created! Please check your email to verify your account.",
      { timeout: 15000 }
    ).should("be.visible");
  });
});