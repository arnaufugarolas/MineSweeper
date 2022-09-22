const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

const url = 'http://localhost:8080/MineSweeper/index.html'

Given(/^a user opens the app$/, async () => {
    await page.goto(url)
})
When(/^the user opens the app$/, function () {

})
Then(/^the value of the remaining flags counter should be: (.*)$/, function () {

})
Then(/^the value of the timer should be: (\d+)$/, function () {

})
When(/^the user starts a new game with a board like: (.*)$/, function () {

})
When(/^the user starts a new game with a random board of: (.*)$/, function () {

})
Then(/^no cells should be exposed$/, function () {

})
Then(/^no cells should be flagged$/, function () {

})
Then(/^no cells should be questioned$/, function () {

})
Given(/^a board like: (.*)$/, function () {

})
When(/^the user reveal the cell at: \(\d+, \d+\)$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) should be revealed$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) should be a mine$/, function () {

})
Then(/^the game should be lost$/, function () {

})
Then(/^the game should be won$/, function () {

})
Given(/^a board like: (.*)$/, function () {

})
When(/^the user reveal the cell at: \(\d+, \d+\)$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) should have a: void$/, function () {

})
Then(/^all the cells around: \(\d+, \d+\) should be revealed$/, function () {

})
Given(/^a board like: (.*)$/, function () {

})
Then(/^the cell at: \((.*), (.*)\) should have a: (.*)$/, function () {

})
When(/^the user flag the cell at: \(\d+, \d+\)$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) should be flagged$/, function () {

})
Given(/^the cell at: \(\d+, \d+\) is flagged$/, function () {

})
When(/^the user remove the flag from the cell at: \(\d+, \d+\)$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) should be unFlagged$/, function () {

})
When(/^the user question the cell at: \(\d+, \d+\)$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) should be questioned$/, function () {

})
Given(/^the cell at: \(\d+, \d+\) is questioned$/, function () {

})
When(/^the user remove the question from the cell at: \(\d+, \d+\)$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) shouldn't be questioned$/, function () {

})
When(/^the user click the smiley$/, function () {

})
Then(/^the game should be restarted$/, function () {

})
Then(/^the cell at: \(\d+, \d+\) shouldn't be flagged$/, function () {

})
