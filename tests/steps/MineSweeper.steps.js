const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

const url = 'http://localhost:8080/MineSweeper/index.html'

Given(/^a user opens the app$/, async () => {
    await page.goto(url)
})
Given(/^a board generated with this mock data: (.*)$/, async (board) => {
    return 'pending'
})
Given(/^a board like:$/, async (board) => {
    return 'pending'
})
Given(/^the cell at: \((\d+), (\d+)\) is flagged$/, async (row, column) => {
    return 'pending'
})
Given(/^the cell at: \((\d+), (\d+)\) is questioned$/, async (row, column) => {
    return 'pending'
})
Given(/^a random board of: (.*)$/, async (size) => {
    return 'pending'
})

When(/^the user reveal the cell at: \((\d+), (\d+)\)$/, async (row, column) => {
    return 'pending'
})
When(/^the user flag the cell at: \((\d+), (\d+)\)$/, async (row, column) => {
    return 'pending'
})
When(/^the user click the smiley$/, async () => {
    return 'pending'
})
When(/^the user remove the flag from the cell at: \((\d+), (\d+)\)$/, async (row, column) => {
    return 'pending'
})
When(/^the user question the cell at: \((\d+), (\d+)\)$/, async (row, column) => {
    return 'pending'
})
When(/^the user remove the question from the cell at: \((\d+), (\d+)\)$/, async (row, column) => {
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
Then(/^the game should be lost$/, async () => {
    return 'pending'
})
Then(/^the game should be won$/, async () => {
    return 'pending'
})
Then(/^the game should be restarted$/, async () => {
    return 'pending'
})
Then(/^there shouldn't be any cell in the board$/, async () => {
    return 'pending'
})
Then(/^the value of the timer should be: (\d+)$/, async (timer) => {
    return 'pending'
})
Then(/^the value of the remaining flags counter should be: (\d+)$/, async (counter) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) should be a mine$/, async (row, column) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) should have a: (.*)$/, async (row, column, value) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) should be flagged$/, async (row, column) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) shouldn't be flagged$/, async (row, column) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) should be questioned$/, async (row, column) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) shouldn't be questioned$/, async (row, column) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) should be revealed$/, async (row, column) => {
    return 'pending'
})
Then(/^the cell at: \((\d+), (\d+)\) shouldn't be revealed$/, async (row, column) => {
    return 'pending'
})
Then(/^the board should be$/, async (table) => {
    return 'pending'
})
Then(/^all the cells around: \((\d+), (\d+)\) should be revealed$/, async (row, column) => {
    return 'pending'
})
