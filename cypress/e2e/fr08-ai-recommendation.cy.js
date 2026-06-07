describe("FR_08 - AI Recommendation Module", () => {
  it("should show matching gift recommendations returned by AI module", () => {
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

    cy.contains("button", "Submit").click();

    cy.wait("@recommendationAPI").then((interception) => {
      expect(interception.response.body.recommendations).to.include("Perfume");
      expect(interception.response.body.recommendations).to.include("Jewellery");
      expect(interception.response.body.recommendations).to.include("Edible Stuff");
    });

    cy.url({ timeout: 10000 }).should("include", "/thank-you");

    cy.contains("Your Personalized Recommendations").should("be.visible");
    cy.contains("Recommended Gift Categories").should("be.visible");

    cy.contains("Perfume").should("be.visible");
    cy.contains("Jewellery").should("be.visible");
    cy.contains("Edible Stuff").should("be.visible");
  });
});