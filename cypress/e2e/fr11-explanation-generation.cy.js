describe("FR_11 - Explanation Generation", () => {
  it("should display recommendation explanation text", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-11",
                name: "Elegant Perfume Gift Box",
                category: "Perfume",
                price: 3000,
                stock: 5,
                isAvailable: true,
                imageUrl:
                  "https://th.bing.com/th/id/OIP.jZNCJvsJBm7PiUpadJy-JAHaHa?w=153&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
                description:
                  "A luxury perfume basket designed for special occasions.",
                recommendationReason:
                  "This recommendation matches the recipient's personality traits, preference for premium gifts, and appreciation for elegant fragrances.",
                baseItem: "Perfume",
                includedItems: [
                  "Perfume",
                  "Chocolate",
                  "Greeting Card",
                ],
              },
            },
          },
          "",
          "/recommend-basket"
        );
      },
    });

    cy.contains("Why this fits you")
      .should("be.visible");

    cy.contains(
      "This recommendation matches the recipient's personality traits"
    ).should("be.visible");
  });
});