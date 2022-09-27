const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

const url = 'http://localhost:8080/MineSweeper/index.html'

Given(/^a user opens the app$/, async () => {
    await page.goto(url)
})
Given(/^a board generated with this mock data: (.*)$/, async (board) => {
    await page.goto(`${url}?mock=${board}`)
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
    const exposedCells = await page.locator('.cellExposed')
    expect(await exposedCells.count()).toBe(0)
})
Then(/^no cells should be flagged$/, async () => {
    const flaggedCells = await page.locator('.cellFlagged')
    expect(await flaggedCells.count()).toBe(0)
})
Then(/^no cells should be questioned$/, async () => {
    const questionedCells = await page.locator('.cellQuestioned')
    expect(await questionedCells.count()).toBe(0)
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
    const board = await page.locator('[data-test-id="board"]')
    const numberOfCells = await board.locator('.cell').count()

    expect(numberOfCells).toBe(0)
})
Then(/^the value of the timer should be: (\d+)$/, async (timer) => {
    const timerValue = await page.locator('[data-test-id="timer"]').innerText()

    expect(parseInt(timerValue)).toBe(timer)
})
Then(/^the value of the remaining flags counter should be: (\d+)$/, async (counter) => {
    const flagCounterValue = await page.locator('[data-test-id="flagsCounter"]').innerText()

    expect(parseInt(flagCounterValue)).toBe(counter)
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
    const board = await page.locator('[data-test-id="board"]')
    const rows = await board.locator('.row')
    const numberOfCellsForRow = await rows.last().locator('.cell').count()
    const expectedBoard = table.split('\n')

    for (let row = 0; row < expectedBoard.length; row++) {
        expectedBoard[row] = expectedBoard[row].replace(/[^a-zA-Z]+/g, '')
    }

    for (let i = 0; i < await rows.count; i++) {
        for (let j = 0; j < numberOfCellsForRow; j++) {
            const cell = await rows.nth(i).locator('.cell').nth(j)
            const cellClass = await cell.getAttribute('class')
            if (expectedBoard[i][j] === 'M') {
                expect(cellClass).toContain('cellMined')
            } else {
                expect(cellClass).not.toContain('cellMined')
            }
        }
    }

    expect(await rows.count()).toBe(expectedBoard.length) // check number of rows
    expect(numberOfCellsForRow).toBe(expectedBoard[0].length) // check number of columns
})
Then(/^all the cells around: \((\d+), (\d+)\) should be revealed$/, async (row, column) => {
    return 'pending'
})
