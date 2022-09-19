const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

const url = 'http://localhost:8080/MineSweeper/'

Given('the user opens the app', async function () {
    await this.page.goto(url)
})
