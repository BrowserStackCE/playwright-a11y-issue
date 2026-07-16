import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../../support/world';

Given('I am on the login page', async function (this: CustomWorld) {
  const loginPage = this.pageFactory.getLoginPage();
  await loginPage.navigate();
});

Given('I open bstackdemo homepage',async function (this: CustomWorld){

  const loginPage = this.pageFactory.getLoginPage();
  await loginPage.navigate();
});


Given('I open scif website',async function (this: CustomWorld){

  const loginPage = this.pageFactory.getLoginPage();
  await loginPage.navigate();
});


When('I enter username {string}', async function (this: CustomWorld, username: string) {
  const loginPage = this.pageFactory.getLoginPage();
  await loginPage.enterUsername(username);  
});

Then('I enter password {string}', async function (this: CustomWorld, password: string) {
  const loginPage = this.pageFactory.getLoginPage();
  await loginPage.enterPassword(password);
});

Then('I click the login button', async function (this: CustomWorld) {
  const loginPage = this.pageFactory.getLoginPage();
  await loginPage.clickLogin();
});

Then('I should see the inventory page', async function (this: CustomWorld) {
  const inventoryPage = this.pageFactory.getInventoryPage();
  const displayed = await inventoryPage.isDisplayed();
  assert.strictEqual(displayed, true, 'Inventory page was not displayed');
});

Then('the page title should be {string}', async function (this: CustomWorld, expected: string) {
  const inventoryPage = this.pageFactory.getInventoryPage();
  const title = await inventoryPage.getTitle();
  assert.strictEqual(title, expected);
});

Then('I add to cart and checkout', async function (this: CustomWorld) {
  const inventoryPage = this.pageFactory.getInventoryPage();
  await inventoryPage.isDisplayed();  
  await inventoryPage.logout();
});

Then('I search for certificate of insurance', async function (this: CustomWorld) {
  const certPage = this.pageFactory.getCertificatePage();
  await certPage.finalStep();  
  //await inventoryPage.logout();
});

Then(
  'the error message should contain {string}',
  async function (this: CustomWorld, expected: string) {
    const loginPage = this.pageFactory.getLoginPage();
    const message = await loginPage.getErrorMessage();
    assert.ok(
      message.includes(expected),
      `Expected error message to contain "${expected}", but got "${message}"`,
    );
  },
);
