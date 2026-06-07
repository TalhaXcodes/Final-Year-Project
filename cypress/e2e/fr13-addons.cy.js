describe("FR_13 - Add-ons", () => {
  it("should add addon and update basket price", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-13",
                name: "Test Personalized Gift",
                category: "Perfume",
                price: 5000,
                stock: 10,
                isAvailable: true,
                imageUrl:
                  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
                baseItem: "Perfume bottle",
                includedItems: [
                  "Perfume bottle",
                  "Greeting card",
                ],
                availableAddons: [
                  {
                    name: "Flowers",
                    price: 500,
                  },
                  {
                    name: "Cake",
                    price: 1200,
                  },
                ],
              },
            },
          },
          "",
          "/recommend-basket"
        );
      },
    });

    cy.contains("Available Add-ons").should("be.visible");

    cy.contains("label", "Flowers")
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("Flowers").should("exist");

    cy.contains("Rs. 5,500").should("be.visible");
  });
});