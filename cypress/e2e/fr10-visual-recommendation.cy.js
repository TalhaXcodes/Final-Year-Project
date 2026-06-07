describe("FR_10 - Visual Recommendation", () => {
  it("should display image of suggested gift basket", () => {
    cy.visit("http://localhost:3000/recommend-basket", {
      onBeforeLoad(win) {
        win.history.pushState(
          {
            usr: {
              selectedCategory: "Perfume",
              packagingChoice: "Simple box",
              selectedTemplate: {
                id: "template-visual-1",
                name: "Elegant Perfume Gift Box",
                category: "Perfume",
                price: 3000,
                stock: 5,
                isAvailable: true,
                imageUrl:
                  "https://th.bing.com/th/id/OIP.jZNCJvsJBm7PiUpadJy-JAHaHa?w=153&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
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
    cy.contains("Elegant Perfume Gift Box").should("be.visible");

    cy.get('img[alt="Elegant Perfume Gift Box"]')
      .should("be.visible")
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });
});