const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

const url = 'http://localhost:8080/MineSweeper/index.html'

Given(/^a user opens the app$/, async () => {
    await page.goto(url)
})
Given(/^a board like: (.*)$/, async () => {
    return 'pending'
})
When(/^the user question the cell at: \((.*), (.*)\)$/, async () => {
    return 'pending'
})
When(/^the user remove the flag from the cell at: \((.*), (.*)\)$/, async () => {
    return 'pending'
})
When(/^the user click the smiley$/, async () => {
    return 'pending'
})
When(/^the user remove the question from the cell at: \((.*), (.*)\)$/, async () => {
    return 'pending'
})
When(/^the user reveal the cell at: \((.*), (.*)\)$/, async () => {
    return 'pending'
})
When(/^the user flag the cell at: \((.*), (.*)\)$/, async () => {
    return 'pending'
})
Then(/^the value of the timer should be: (\d+)$/, async () => {
    return 'pending'
})
Then(/^the value of the flags counter should be: (\d+)$/, async () => {
    return 'pending'
})
Then(/^no cells should be exposed$/, async () => {
    return 'pending'
})
Then(/^no cells should be flagged$/, async () => {
    return 'pending'
})
Then(/^no cells should be questioned$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) should be revealed$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) should be a mine$/, async () => {
    return 'pending'
})
Then(/^the game should be lost$/, async () => {
    return 'pending'
})
Then(/^the game should be won$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) should have a: (.*)$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) should be flagged$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) should be unFlagged$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) shouldn't be questioned$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) should be questioned$/, async () => {
    return 'pending'
})
Then(/^the game should be restarted$/, async () => {
    return 'pending'
})
Then(/^the cell at: \((.*), (.*)\) shouldn't be flagged$/, async () => {
    return 'pending'
})
Then(/^all the cells around: \((.*), (.*)\) should be revealed$/, async () => {
    return 'pending'
})
