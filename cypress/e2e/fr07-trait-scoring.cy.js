describe("FR_07 - Trait Scoring", () => {
  it("should generate trait scores after questionnaire submission", () => {
    cy.intercept("POST", "http://localhost:5000/recommend", {
      statusCode: 200,
      body: {
        recommendations: ["Perfume", "Jewellery", "Edible Stuff"],
        traitScores: {
          emotional: 80,
          practical: 60,
          luxury: 75,
          creativity: 70,
        },
      },
    }).as("recommendationAPI");

    cy.visit("http://localhost:3000/questionnaire");

    cy.contains("Birthday").click();
    cy.contains("Friend").click();
    cy.contains("Male").click();
    cy.contains("Adult").click();
    cy.get("select").select("20–25");
    cy.contains("1–3 year").click();

    cy.contains("button", "Next").click();

    cy.contains("Number of gifts").should("be.visible");
    cy.contains("button", "Next").click();

    cy.contains("Gift Details").should("be.visible");
    cy.get("select").select("3000–5000 PKR");

    cy.contains("button", "Next").click();

    cy.contains("Recipient Personality Analysis").should("be.visible");

    cy.get('input[type="range"]').eq(0).invoke("val", 5).trigger("change");
    cy.get('input[type="range"]').eq(1).invoke("val", 4).trigger("change");
    cy.get('input[type="range"]').eq(2).invoke("val", 4).trigger("change");

    cy.contains("button", "Next").click();

    cy.contains("Gift Packaging").should("be.visible");
    cy.contains("Simple box").click();

    cy.contains("button", "Submit").should("not.be.disabled").click();

    cy.wait("@recommendationAPI").then((interception) => {
      expect(interception.response.body.traitScores).to.exist;
      expect(interception.response.body.traitScores.emotional).to.equal(80);
      expect(interception.response.body.traitScores.practical).to.equal(60);
      expect(interception.response.body.traitScores.luxury).to.equal(75);
      expect(interception.response.body.traitScores.creativity).to.equal(70);
    });

    cy.url({ timeout: 10000 }).should("include", "/thank-you");
  });
});