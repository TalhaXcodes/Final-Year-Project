describe("FR_09 - Inventory Check", () => {
  it("should show in-stock status and allow continue when stock is available", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-1",
                name: "Elegant Perfume Gift Box",
                category: "Perfume",
                price: 3000,
                stock: 5,
                isAvailable: true,
                imageUrl: "https://th.bing.com/th/id/OIP.jZNCJvsJBm7PiUpadJy-JAHaHa?w=153&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
                description: "A perfume based personalized basket.",
                baseItem: "Perfume",
                includedItems: ["Perfume", "Chocolate", "Greeting Card"],
              },
            },
          },
          "",
          "/recommend-basket"
        );
      },
    });

    cy.contains("Your Recommended Basket").should("be.visible");

    cy.contains("In Stock (5 available)").should("be.visible");

    cy.contains("button", "Continue with Basket")
      .should("not.be.disabled");
  });

  it("should show out-of-stock status and disable continue button", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-2",
                name: "Elegant Perfume Gift Box",
                category: "Perfume",
                price: 3000,
                stock: 0,
                isAvailable: true,
                imageUrl: "https://th.bing.com/th/id/OIP.jZNCJvsJBm7PiUpadJy-JAHaHa?w=153&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
                description: "A perfume based personalized basket.",
                baseItem: "Perfume",
                includedItems: ["Perfume", "Chocolate", "Greeting Card"],
              },
            },
          },
          "",
          "/recommend-basket"
        );
      },
    });

    cy.contains("Your Recommended Basket").should("be.visible");

    cy.contains("Out of Stock").should("be.visible");

    cy.contains("button", "Out of Stock")
      .should("be.disabled");
  });
});