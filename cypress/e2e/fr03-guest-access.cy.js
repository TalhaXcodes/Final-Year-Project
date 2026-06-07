describe("FR_03 - Guest Access", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.window().then((win) => {
      win.sessionStorage.clear();

      if (win.indexedDB && win.indexedDB.databases) {
        win.indexedDB.databases().then((databases) => {
          databases.forEach((db) => {
            win.indexedDB.deleteDatabase(db.name);
          });
        });
      }
    });
  });

  it("should allow guest to access questionnaire", () => {
    cy.visit("http://localhost:3000/guest-access");
    cy.wait(3000);

    cy.contains("Start as Guest").click();
    cy.wait(3000);

    cy.url().should("include", "/questionnaire");
  });

  it("should restrict checkout for guest user", () => {
    cy.visit("http://localhost:3000", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "basketries_cart",
          JSON.stringify([
            {
              id: "test-product-1",
              name: "Test Gift Basket",
              category: "Gift Baskets",
              price: 2500,
              quantity: 1,
              stock: 5,
              imageUrl: "https://via.placeholder.com/150",
            },
          ])
        );
      },
    });

    cy.visit("http://localhost:3000/checkout");
    cy.wait(3000);

    cy.contains("Checkout").should("be.visible");
    cy.contains("Login to Checkout").should("be.visible");
    cy.contains(/login or create an account/i).should("be.visible");

    cy.wait(3000);
  });
});