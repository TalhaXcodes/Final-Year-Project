describe("FR_15 - Cart Management", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit("http://localhost:3000", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "basketries_cart",
          JSON.stringify([
            {
              id: "cart-test-1",
              name: "Test Personalized Gift",
              category: "Perfume Personalized Basket",
              selectedCategory: "Perfume",
              price: 5000,
              quantity: 1,
              stock: 5,
              imageUrl:
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
              type: "personalized",
              baseItem: "Perfume bottle",
              selectedItems: ["Perfume bottle", "Greeting card"],
              packagingChoice: "Simple box",
            },
          ])
        );
      },
    });
  });

  it("should review, update, apply discount, and remove cart item", () => {
    cy.visit("http://localhost:3000/cart");

    cy.contains("Shopping Cart").should("be.visible");
    cy.contains("Order Summary").should("be.visible");
    cy.contains("Test Personalized Gift").should("be.visible");

    cy.contains("Total Items").parent().contains("1").should("be.visible");
    cy.contains("Subtotal").parent().contains("Rs 5,000").should("be.visible");
    cy.contains("Total").parent().contains("Rs 5,000").should("be.visible");

    // Increase quantity
    cy.get('button[title="Remove item"]')
      .parents(".bg-white")
      .first()
      .within(() => {
        cy.get("button").eq(2).click();
      });

    cy.contains("Total Items").parent().contains("2").should("be.visible");
    cy.contains("Subtotal").parent().contains("Rs 10,000").should("be.visible");

    // Decrease quantity
    cy.get('button[title="Remove item"]')
      .parents(".bg-white")
      .first()
      .within(() => {
        cy.get("button").eq(1).click();
      });

    cy.contains("Total Items").parent().contains("1").should("be.visible");
    cy.contains("Subtotal").parent().contains("Rs 5,000").should("be.visible");

    // Apply discount code
    cy.get('input[placeholder="Enter code"]').type("BASKET10");
    cy.contains("button", "Apply").click();

    cy.contains("10% discount applied").should("be.visible");
    cy.contains("Discount").parent().contains("- Rs 500").should("be.visible");
    cy.contains("span", "Rs 4,500").should("be.visible");

    // Review order button
    cy.contains("button", "Review Order").should("be.visible");

    // Remove item
    cy.get('button[title="Remove item"]').click();

    cy.contains("Your Cart is Empty").should("be.visible");
  });
});