const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

const url = 'http://localhost:8080/MineSweeper/index.html'

/**
 * @param rowNumber {number}
 * @param columnNumber {number}
 * @returns {Promise<Locator>}
 */
async function getCell (rowNumber, columnNumber) {
    const board = await page.locator('[data-test-id="board"]')
    const row = await board.locator('tr').nth(rowNumber - 1)
    const cell = await row.locator('td button').nth(columnNumber - 1)

    if (rowNumber - 1 < 0 || columnNumber - 1 < 0) { return null }
    if (await cell.count() === 1) { return cell }

    return null
}

/**
 * @param rowNumber {number}
 * @param columnNumber {number}
 * @returns {Promise<Locator[]>}
 */
async function getCellsAround (rowNumber, columnNumber) {
    const cells = []

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                const cell = await getCell(rowNumber + i, columnNumber + j)
                if (cell !== null) { cells.push(cell) }
            }
        }
    }

    return cells
}

/**
 * @param rowNumber {number}
 * @param columnNumber {number}
 * @returns {Promise<boolean>}
 */
async function cellIsFlagged (rowNumber, columnNumber) {
    const cell = await getCell(rowNumber, columnNumber)

    return (await cell.getAttribute('class')).includes('cellFlagged')
}

/**
 * @param rowNumber {number}
 * @param columnNumber {number}
 * @returns {Promise<boolean>}
 */
async function cellIsQuestioned (rowNumber, columnNumber) {
    const cell = await getCell(rowNumber, columnNumber)

    return (await cell.getAttribute('class')).includes('cellQuestioned')
}

/**
 * Given
 */
Given(/^a user opens the app$/, async () => {
    await page.goto(url, { waitUntil: 'load' })
})
Given(/^a board generated with this mock data: (.*)$/, async (board) => {
    await page.goto(`${url}?mock=${board}`, { waitUntil: 'load' })
})
Given(/^the cell at: \((\d+), (\d+)\) is flagged$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    await cell.click({ button: 'right' })
})
Given(/^the cell at: \((\d+), (\d+)\) is questioned$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    await cell.dblclick({ button: 'right' })
})
Given(/^a random board of: (.*)$/, async (size) => {
    return 'pending'
})
/**
 * When
 */
When(/^the user reveal the cell at: \((\d+), (\d+)\)$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    await cell.click()
})
When(/^the user flag the cell at: \((\d+), (\d+)\)$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    await cell.click({ button: 'right' })
})
When(/^the user remove the flag from the cell at: \((\d+), (\d+)\)$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    if ((await cell.getAttribute('class')).includes('cellFlagged')) {
        await cell.dblclick({ button: 'right' })
    }
})
When(/^the user question the cell at: \((\d+), (\d+)\)$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    if ((await cell.getAttribute('class')).includes('cellFlagged')) {
        await cell.click({ button: 'right' })
    } else {
        await cell.dblclick({ button: 'right' })
    }
})
When(/^the user remove the question from the cell at: \((\d+), (\d+)\)$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)

    if ((await cell.getAttribute('class')).includes('cellQuestioned')) {
        await cell.click({ button: 'right' })
    }
})
When(/^the user click the smiley$/, async () => {
    const smiley = await page.locator('[data-test-id="smiley"]')

    await smiley.click()
})
/**
 * Then
 */
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
    const smiley = await page.locator('[data-test-id="smiley"]')

    expect(await smiley.textContent()).toBe('Sad')
})
Then(/^the game should be won$/, async () => {
    const smiley = await page.locator('[data-test-id="smiley"]')

    expect(await smiley.textContent()).toBe('Happy')
})
Then(/^there shouldn't be any cell in the board$/, async () => {
    const board = await page.locator('[data-test-id="board"]')

    expect(await board.locator('.cell').count()).toBe(0)
})
Then(/^the value of the timer should be: (\d+)$/, async (expectedValue) => {
    const timer = await page.locator('[data-test-id="timer"]')

    expect(parseInt(await timer.innerText())).toBe(expectedValue)
})
Then(/^the value of the remaining flags counter should be: (\d+)$/, async (expectedValue) => {
    const flagCounter = await page.locator('[data-test-id="flagsCounter"]')

    expect(parseInt(await flagCounter.innerText())).toBe(expectedValue)
})
Then(/^the cell at: \((\d+), (\d+)\) should have a: (.*)$/, async (rowNumber, columnNumber, expectedValue) => {
    const cell = await getCell(rowNumber, columnNumber)
    const cellValue = await cell.innerText()

    if (expectedValue === 'void') {
        expect(cellValue).toBe('\xa0')
    } else {
        expect(cellValue).toBe(expectedValue.toString())
    }
})
Then(/^the board should be:$/, async (table) => {
    const board = await page.locator('[data-test-id="board"]')
    const rows = await board.locator('.row')
    const numberOfCellsForRow = await rows.last().locator('.cell').count()
    const expectedBoard = table.split('\n')

    for (let row = 0; row < expectedBoard.length; row++) {
        expectedBoard[row] = expectedBoard[row].replace(/[^a-zA-Z0-9]+/g, '')
    }

    for (let i = 0; i < await rows.count; i++) {
        for (let j = 0; j < numberOfCellsForRow; j++) {
            const cell = await rows.nth(i).locator('.cell').nth(j)
            const cellClass = await cell.getAttribute('class')

            if (expectedBoard[i][j] === 'M') {
                expect(cellClass).toContain('cellMined')
            } else if (expectedBoard[i][j] === 'F' || expectedBoard[i][j] === 'f') {
                expect(cellClass).toContain('cellFlagged')
            } else if (expectedBoard[i][j] === 'Q' || expectedBoard[i][j] === 'q') {
                expect(cellClass).toContain('cellQuestioned')
            } else if (expectedBoard[i][j] === 'H') {
                expect(cellClass).not.toContain('cellExposed')
            } else if (expectedBoard[i][j].match(/[0-8]/)) {
                expect(cellClass).toContain('cellExposed')
                expect(await cell.innerText()).toBe(expectedBoard[i][j])
            }
        }
    }

    expect(await rows.count()).toBe(expectedBoard.length) // check number of rows
    expect(numberOfCellsForRow).toBe(expectedBoard[0].length) // check number of columns
})
Then(/^all the cells around: \((\d+), (\d+)\) should be revealed$/, async (rowNumber, columnNumber) => {
    const cellsAround = await getCellsAround(rowNumber, columnNumber)
    for (const cell of cellsAround) {
        const cellClass = await cell.getAttribute('class')
        expect(cellClass).toContain('cellExposed')
    }
})
Then(/^the cell at: \((\d+), (\d+)\) should be flagged$/, async (rowNumber, columnNumber) => {
    expect(await cellIsFlagged(rowNumber, columnNumber)).toBe(true)
})
Then(/^the cell at: \((\d+), (\d+)\) shouldn't be flagged$/, async (rowNumber, columnNumber) => {
    expect(await cellIsFlagged(rowNumber, columnNumber)).toBe(false)
})
Then(/^the cell at: \((\d+), (\d+)\) should be questioned$/, async (rowNumber, columnNumber) => {
    expect(await cellIsQuestioned(rowNumber, columnNumber)).toBe(true)
})
Then(/^the cell at: \((\d+), (\d+)\) shouldn't be questioned$/, async (rowNumber, columnNumber) => {
    expect(await cellIsQuestioned(rowNumber, columnNumber)).toBe(false)
})
Then(/^All the mines should be blown up$/, async () => {
    const mines = await page.locator('.cellMined')

    for (let i = 0; i < await mines.count(); i++) {
        const mine = mines.nth(i)
        const mineClass = await mine.getAttribute('class')

        expect(mineClass).toContain('cellExposed')
    }
})
Then(/^the game should be restarted$/, async () => {
    const smiley = await page.locator('[data-test-id="smiley"]')

    expect(await smiley.textContent()).toBe('Bored')
})
Then(/^the cell at: \((\d+), (\d+)\) shouldn't be revealed$/, async (rowNumber, columnNumber) => {
    const cell = await getCell(rowNumber, columnNumber)
    const cellClass = await cell.getAttribute('class')

    expect(cellClass).not.toContain('cellExposed')
})
Then(/^the board should have: (\d+) rows$/, async (expectedValue) => {
    return 'pending'
})
Then(/^the board should have: (\d+) columns for each row$/, async (expectedValue) => {
    return 'pending'
})
