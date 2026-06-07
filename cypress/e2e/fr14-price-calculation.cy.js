describe("FR_14 - Price Calculation", () => {
  it("should dynamically update total price when add-ons are selected or removed", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-14",
                name: "Test Personalized Gift",
                category: "Perfume",
                price: 5000,
                stock: 10,
                isAvailable: true,
                imageUrl:
                  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
                baseItem: "Perfume bottle",
                includedItems: ["Perfume bottle", "Greeting card"],
                availableAddons: [
                  { name: "Flowers", price: 500 },
                  { name: "Cake", price: 1200 },
                ],
              },
            },
          },
          "",
          "/recommend-basket"
        );
      },
    });

    cy.contains("Price Summary").should("be.visible");

    cy.contains("Base Basket Price").should("be.visible");
    cy.contains("Rs. 5,000").should("be.visible");

    cy.contains("Add-ons Total").should("be.visible");
    cy.contains("Rs. 0").should("be.visible");

    cy.contains("Final Price").should("be.visible");
    cy.contains("Rs. 5,000").should("be.visible");

    // Add Flowers (+500)
    cy.contains("label", "Flowers")
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("Rs. 500").should("be.visible");
    cy.contains("Rs. 5,500").should("be.visible");

    // Add Cake (+1200)
    cy.contains("label", "Cake")
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("Rs. 1,700").should("be.visible");
    cy.contains("Rs. 6,700").should("be.visible");

    // Remove Flowers (-500)
    cy.contains("label", "Flowers")
      .find('input[type="checkbox"]')
      .uncheck({ force: true });

    cy.contains("Rs. 1,200").should("be.visible");
    cy.contains("Rs. 6,200").should("be.visible");
  });
});