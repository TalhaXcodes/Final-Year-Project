const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

async function loginValidationTest() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/login");

    console.log("Opened:", await driver.getCurrentUrl());
    console.log("Title:", await driver.getTitle());

    await driver.sleep(2000);

    const buttons = await driver.findElements(By.css("button"));
    console.log("Buttons found:", buttons.length);

    await buttons[0].click();

    await driver.sleep(2000);

    const bodyText = await driver.findElement(By.css("body")).getText();
    console.log("PAGE TEXT AFTER CLICK:");
    console.log(bodyText);

    if (bodyText.includes("Please fill in all fields")) {
      console.log("PASS: Empty login validation message shown");
    } else {
      console.log("FAIL: Expected validation message not found");
    }

    await driver.sleep(5000);
  } catch (error) {
    console.log("FAIL:", error.message);
    await driver.sleep(5000);
  } finally {
    await driver.quit();
  }
}

loginValidationTest();