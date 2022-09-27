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
                cell.addEventListener('click', s._cellClickHandler.bind(cell, s))
                td.appendChild(cell)
                tr.appendChild(td)
            }
            s._board.appendChild(tr)
        }
        s._flagsCounter.textContent = numberOfMines.toString()
    }

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
     * @param s {MineSweeper}
     * @this {HTMLButtonElement}
     */
    _cellClickHandler (s) {
        if (s._gameStatus === 'playing' && !this.classList.contains('cellExposed')) {
            this.classList.add('cellExposed')
            console.log(s._getCellNeighbours(this))
            console.log('click')
        }
    }

    _getCellNeighbours (cell) {
        const s = this
        const cellRows = cell.parentNode.parentNode.parentNode
        const cellRow = cell.parentNode.parentNode
        const cellColumn = cell.parentNode
        const cellRowNumber = cellRow.rowIndex
        const cellColumnNumber = cellColumn.cellIndex
        const neighbours = []

        console.log('\ncellRow: ', cellRow, '\ncellColumn: ', cellColumn, '\ncellRowNumber: ', cellRowNumber, '\ncellCoulumnNumber:', cellColumnNumber, '\nCellRowns: ', cellRows)
        for (let i = -1; i <= 2; i++) {
            for (let j = -1; j <= 2; j++) {
                const row = cellRowNumber + i
                const column = cellColumnNumber + j

                if (row >= 0 && row < s._board.rows.length && column >= 0 && column < s._board.rows[row].cells.length) {
                    neighbours.push(s._board.rows[row].cells[column].firstChild)
                }
            }
        }

        return neighbours
    }
}
