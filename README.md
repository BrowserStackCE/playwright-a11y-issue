# node-js-playwright-browserstack
This repo contains sample for running Pla.

![BrowserStack Logo](https://www.browserstack.com/images/static/header-logo.jpg)

## Setup

* Clone the repo `git clone https://github.com/BrowserStackCE/playwright-a11y-issue.git` and run `cd playwright-a11y-issue`.
* Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` as environment variables with your [BrowserStack Username and Access Key](https://www.browserstack.com/accounts/settings) or update the same in `browserstack.yml` file.
* Run `npm i` to install the dependencies.

## Running your tests

- Set the below envurionment variables
```
    USE_BROWSERSTACK_SDK=true
    BASE_URL=https://t2.statefunddirect.com
```
- Add the website credentials in the feature file `src/features/login.feature`
```
    When I enter username "<Your username>"
    And I enter password "<Your password>" 

```
- To run the sample tests in parallel across the platforms specified in the `browserstack.yml`, run `npm run test:browserstackwindows`.

## Notes
* You can view your test results on the [BrowserStack Automate dashboard](https://www.browserstack.com/automate)
* Understand how many parallel sessions you need by using our [Parallel Test Calculator](https://www.browserstack.com/automate/parallel-calculator?ref=github)
