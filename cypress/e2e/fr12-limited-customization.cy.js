describe("FR_12 - Limited Customization", () => {
  it("should allow user to remove included item and add available add-on", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-12",
                name: "Test Personalized Gift",
                category: "Perfume",
                price: 5000,
                stock: 10,
                isAvailable: true,
                imageUrl:
                  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
                description: "A perfume based personalized basket.",
                recommendationReason:
                  "This basket fits the recipient's premium fragrance preference.",
                baseItem: "Perfume bottle",
                includedItems: [
                  "Perfume bottle",
                  "Mini chocolates",
                  "Greeting card",
                  "Decorative box",
                ],
                availableAddons: [
                  { name: "Flowers", price: 500 },
                  { name: "Cake", price: 1200 },
                  { name: "Teddy Bear", price: 800 },
                ],
              },
            },
          },
          "",
          "/recommend-basket"
        );
      },
    });

    cy.contains("Customize Your Basket").should("be.visible");
    cy.contains("Selected 4/6 items.").should("be.visible");

    cy.contains("label", "Perfume bottle")
      .find('input[type="checkbox"]')
      .should("be.disabled");

    cy.contains("label", "Mini chocolates")
      .find('input[type="checkbox"]')
      .uncheck({ force: true });

    cy.contains("Selected 3/6 items.").should("be.visible");

    cy.contains("label", "Flowers")
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("Selected 4/6 items.").should("be.visible");

    cy.contains("li", "Flowers").should("be.visible");
    cy.contains("Rs. 5,500").should("be.visible");
  });
});