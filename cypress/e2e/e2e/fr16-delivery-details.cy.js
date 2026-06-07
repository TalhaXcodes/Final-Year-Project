describe("FR_16 - Delivery Details", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit("http://localhost:3000", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "basketries_cart",
          JSON.stringify([
            {
              id: "test-item",
              name: "Test Gift Basket",
              category: "Perfume",
              price: 5000,
              quantity: 1,
              stock: 5,
              imageUrl:
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
            },
          ])
        );
      },
    });
  });

  it("should allow user to enter delivery details", () => {
    cy.visit("http://localhost:3000/checkout");

    cy.contains("Checkout").should("be.visible");

    cy.get('input[name="fullName"]')
      .type("Muhammad Talha Shahbaz")
      .should("have.value", "Muhammad Talha Shahbaz");

    cy.get('input[name="phone"]')
      .type("03001234567")
      .should("have.value", "03001234567");

    cy.get('input[name="city"]')
      .type("Lahore")
      .should("have.value", "Lahore");

    cy.get('textarea[name="address"]')
      .type("House 123, Johar Town Lahore")
      .should("have.value", "House 123, Johar Town Lahore");

    cy.contains("Delivery Information").should("be.visible");
  });
});