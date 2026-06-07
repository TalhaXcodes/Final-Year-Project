describe("FR_18 - Order Confirmation", () => {
    it("should place order and display order confirmation screen", () => {
        cy.visit("http://localhost:3000/login", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "basketries_cart",
                    JSON.stringify([
                        {
                            id: "ArcnQCcwcH1jngh7whMb",
                            name: "Test Personalized Gift",
                            category: "Perfume",
                            price: 5000,
                            quantity: 1,
                            stock: 5,
                            imageUrl:
                                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
                            type: "personalized",
                            selectedItems: ["Perfume bottle", "Greeting card"],
                            baseItem: "Perfume bottle",
                            packagingChoice: "Simple box",
                        },
                    ])
                );
            },
        });

        cy.get('input[name="email"]').clear().type("tshahbaz36@gmail.com");

        cy.get('input[name="password"]')
            .clear()
            .type("talhas5951", {
                parseSpecialCharSequences: false,
            });

        cy.get("form").within(() => {
            cy.get('button[type="submit"]').click({ force: true });
        });

        cy.url({ timeout: 15000 }).should("include", "/dashboard");

        cy.visit("http://localhost:3000/checkout");

        cy.contains("Checkout", { timeout: 10000 }).should("be.visible");

        cy.get('input[name="fullName"]').type("Muhammad Talha Shahbaz");
        cy.get('input[name="phone"]').type("03001234567");
        cy.get('input[name="city"]').type("Lahore");
        cy.get('textarea[name="address"]').type("House 123, Johar Town Lahore");

        cy.contains("Payment Method: Cash on Delivery").should("be.visible");

        cy.contains("button", "Place Order")
            .should("be.visible")
            .click({ force: true });

        cy.wait(5000);

        cy.get("body").then(($body) => {
            const pageText = $body.text();
            cy.log(pageText);
            console.log("CHECKOUT PAGE TEXT:", pageText);
        });

        cy.url().then((url) => {
            cy.log("CURRENT URL: " + url);
            console.log("CURRENT URL:", url);
        });

        cy.contains("Order Confirmed").should("be.visible");
        cy.contains("Order ID").should("be.visible");
        cy.contains("Cash on Delivery").should("be.visible");
        cy.contains("Pending").should("be.visible");
        cy.contains("Confirmation Email").should("be.visible");
    });
});