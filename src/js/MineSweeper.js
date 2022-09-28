window.addEventListener('load', function () {
    const params = new URLSearchParams(location.search)
    const gameOptions = new Map([['boardType', 'default'], ['data', 'null']])

    if (params.has('mock')) {
        const data = params.get('mock')
        gameOptions.set('boardType', 'mock')
        gameOptions.set('data', data)
    } else if (params.has('random')) {
        const data = params.get('random')
        gameOptions.set('boardType', 'random')
        gameOptions.set('data', data)
    }

    const game = new MineSweeper(gameOptions)
    game.init()
})

class MineSweeper {
    /**
     * @param gameOptions {Map} - The game options object.
     */
    constructor (gameOptions) {
        const s = this

        s._gameOptions = gameOptions
        s._board = document.getElementById('board')
        s._flagsCounter = document.getElementById('flagsCounter')
        s._timer = document.getElementById('timer')
        s._smiley = document.getElementById('smiley')
    }

    init () {
        const s = this

        s._createBoard()
        s._gameStatus = 'playing'
    }

    _createBoard () {
        const s = this
        const boardType = s._gameOptions.get('boardType')
        const data = s._gameOptions.get('data')

        switch (boardType) {
            case 'mock':
                s._createBoardFromMockData(data)
                break
            case 'default':
                s._flagsCounter.textContent = '0'
                break
        }
        s._timer.textContent = '0'
        s._smiley.textContent = 'Bored'
    }

    /**
     * @param data {String} - a string of characters that represent the board.
     */
    _createBoardFromMockData (data) {
        const s = this
        const rows = data.split('^')
        let numberOfMines = 0

        for (const row of rows) {
            const tr = document.createElement('tr')
            tr.setAttribute('class', 'row')

            for (const column of row) {
                const td = document.createElement('td')
                const cell = document.createElement('button')

                cell.textContent = '\xa0'
                cell.classList.add('cell')
                if (column === 'M') {
                    cell.classList.add('cellMined')
                    numberOfMines++
                }
                s._cellEventHandler(cell)

                td.appendChild(cell)
                tr.appendChild(td)
            }
            s._board.appendChild(tr)
        }
        s._flagsCounter.textContent = numberOfMines.toString()
    }

    /**
     * @returns {String} The status of the game.
     */
    _checkGameStatus () {
        const s = this
        const exposedCells = document.getElementsByClassName('cellExposed')
        const numberOfMines = document.getElementsByClassName('cellMined').length
        const numberOfCells = document.getElementsByClassName('cell').length

        for (const cell of exposedCells) {
            if (cell.classList.contains('cellMined')) {
                s._smiley.textContent = 'Sad'
                return 'lost'
            }
        }

        if (exposedCells.length === numberOfCells - numberOfMines) {
            s._smiley.textContent = 'Happy'
            return 'win'
        }

        return 'playing'
    }

    /**
     * @param cell {HTMLButtonElement} - The cell that we want to get the neighbours of.
     * @returns {HTMLButtonElement[]} An array of the neighbours of the cell.
     */
    _getCellNeighbours (cell) {
        const s = this
        const cellRow = cell.parentNode.parentNode
        const cellColumn = cell.parentNode
        const cellRowNumber = cellRow.rowIndex - 1
        const cellColumnNumber = cellColumn.cellIndex
        const neighbours = []

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) { continue }
                const row = cellRowNumber + i
                const column = cellColumnNumber + j

                if (row >= 0 && row < s._board.rows.length && column >= 0 && column < s._board.rows[row].cells.length) {
                    neighbours.push(s._board.rows[row].cells[column].firstChild)
                }
            }
        }

        return neighbours
    }

    /**
     * @param s {MineSweeper}
     * @this {HTMLButtonElement}
     */
    _cellLeftClickHandler (s) {
        if (s._gameStatus === 'playing' && !this.classList.contains('cellExposed')) {
            const neighbours = s._getCellNeighbours(this)
            let numberOfMinedNeighbours = 0

            for (const neighbour of neighbours) {
                if (neighbour.classList.contains('cellMined')) {
                    numberOfMinedNeighbours++
                }
            }
            this.textContent = numberOfMinedNeighbours === 0 ? '\xa0' : numberOfMinedNeighbours.toString()
            if (numberOfMinedNeighbours === 0) {
                for (const neighbour of neighbours) {
                    neighbour.click()
                }
            }

            this.classList.add('cellExposed')
            if (this.classList.contains('cellFlagged')) {
                this.classList.remove('cellFlagged')
                s._flagsCounter.textContent = (parseInt(s._flagsCounter.textContent) + 1).toString()
            }
            s._gameStatus = s._checkGameStatus()
        }
    }

    /**
     * @param s {MineSweeper} - the game object
     * @this {HTMLButtonElement}
     */
    _cellRightClickHandler (s) {
        if (s._gameStatus === 'playing' && !this.classList.contains('cellExposed')) {
            if (this.classList.contains('cellFlagged')) {
                this.classList.remove('cellFlagged')
                this.classList.add('cellQuestioned')
                s._flagsCounter.textContent = (parseInt(s._flagsCounter.textContent) + 1).toString()
            } else if (this.classList.contains('cellQuestioned')) {
                this.classList.remove('cellQuestioned')
            } else {
                this.classList.add('cellFlagged')
                s._flagsCounter.textContent = (parseInt(s._flagsCounter.textContent) - 1).toString()
            }
        }
    }

    /**
     * @param cell {HTMLButtonElement} - the cell that the event handler is being added to
     */
    _cellEventHandler (cell) {
        const s = this

        cell.addEventListener('click', s._cellLeftClickHandler.bind(cell, s))

        cell.addEventListener('contextmenu', async function (e) {
            e.preventDefault()
            await s._cellRightClickHandler.bind(cell, s)(e)
        })
    }
}
