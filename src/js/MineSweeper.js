window.addEventListener('load', function () {
    const params = new URLSearchParams(location.search)
    const gameOptions = new Map([['boardType', 'default'], ['data', '']])
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

        s._board = document.getElementById('board')
        s._flagsCounter = document.getElementById('flagsCounter')
        s._timer = document.getElementById('timer')
        s._smiley = document.getElementById('smiley')
        s._smileyEventHandler(s._smiley)
        s._gameOptions = gameOptions
        s._timerInterval = 0
    }

    init () {
        const s = this

        s._gameStatus = 'standby'
        clearInterval(s._timerInterval)
        s._createBoard()
    }

    _createBoard () {
        const s = this
        const boardType = s._gameOptions.get('boardType')
        const data = s._gameOptions.get('data')

        switch (boardType) {
            case 'mock':
                s._createBoardMockData(data)
                break
            case 'random':
                s._createBoardRandom(s._dataToOptionsMap(data))
                break
            case 'default':
                s._flagsCounter.textContent = '0'
                break
        }

        s._timer.textContent = '0'
        s._smiley.textContent = 'Bored'
    }

    /**
     * @param options {Map}
     */
    _createBoardRandom (options) {
        const s = this
        const rowsNumber = parseInt(options.get('size').split('x')[0])
        const columnsNumber = parseInt(options.get('size').split('x')[1])

        for (let i = 0; i < rowsNumber; i++) {
            const tr = document.createElement('tr')
            tr.setAttribute('class', 'row')

            for (let j = 0; j < columnsNumber; j++) {
                const td = document.createElement('td')
                const cell = document.createElement('button')

                cell.textContent = '\xa0'
                cell.classList.add('cell')
                s._cellEventHandler(cell)

                td.appendChild(cell)
                tr.appendChild(td)
            }
            s._board.appendChild(tr)
        }
        s._createBoardRandomAddMines(options)
    }

    _createBoardRandomAddMines (options) {
        const s = this
        const rowsNumber = parseInt(options.get('size').split('x')[0])
        const columnsNumber = parseInt(options.get('size').split('x')[1])
        let mines = options.get('mines')
        s._flagsCounter.textContent = mines

        while (mines > 0) {
            const row = Math.floor(Math.random() * rowsNumber)
            const column = Math.floor(Math.random() * columnsNumber)
            const cell = s._board.rows[row].cells[column].firstChild

            if (!cell.classList.contains('cellMined')) {
                cell.classList.add('cellMined')
                mines--
            }
        }
    }

    /**
     * @param options {string}
     * @returns {Map}
     */
    _dataToOptionsMap (options) {
        const optionsMap = new Map()
        const optionsArray = options.replace(/[{}]/g, '').split(',')

        for (const option of optionsArray) {
            const optionArray = option.split('=')

            optionsMap.set(optionArray[0], optionArray[1])
        }

        return optionsMap
    }

    /**
     * @param data {string}
     */
    _createBoardMockData (data) {
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
     * @returns {string}
     */
    _checkGameStatus () {
        const s = this
        const exposedCells = document.getElementsByClassName('cellExposed')
        const numberOfMines = document.getElementsByClassName('cellMined').length
        const numberOfCells = document.getElementsByClassName('cell').length

        for (const cell of exposedCells) {
            if (cell.classList.contains('cellMined')) {
                const mines = document.getElementsByClassName('cellMined')

                for (const mine of mines) {
                    mine.classList.add('cellExposed')
                }
                s._smiley.textContent = 'Sad'

                clearInterval(s._timerInterval)

                return 'lost'
            }
        }

        if (exposedCells.length === numberOfCells - numberOfMines) {
            s._smiley.textContent = 'Happy'
            clearInterval(s._timerInterval)
            return 'win'
        }

        return 'playing'
    }

    /**
     * @param cell {HTMLButtonElement}
     * @returns {Promise<HTMLButtonElement[]>}
     */
    async _getCellNeighbours (cell) {
        const s = this
        const cellRow = cell.parentNode.parentNode
        const cellColumn = cell.parentNode
        const cellRowNumber = cellRow.rowIndex - 1
        const cellColumnNumber = cellColumn.cellIndex
        const neighbours = []

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue
                }
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
    _cellFirstsClickHandler (s) {
        if (s._gameStatus === 'standby') {
            s._gameStatus = 'playing'
            s._timerInterval = setInterval(function () {
                s._timer.textContent = (parseInt(s._timer.textContent) + 1).toString()
            }, 1000)
        }
    }

    /**
     * @param s {MineSweeper}
     * @this {HTMLButtonElement}
     */
    async _cellLeftClickHandler (s) {
        if (s._gameStatus === 'playing' && !this.classList.contains('cellExposed')) {
            this.classList.add('cellExposed')
            if (this.classList.contains('cellFlagged')) {
                this.classList.remove('cellFlagged')
                s._flagsCounter.textContent = (parseInt(s._flagsCounter.textContent) + 1).toString()
            } else if (this.classList.contains('cellQuestioned')) {
                this.classList.remove('cellQuestioned')
            }

            const neighbours = await s._getCellNeighbours(this)
            let numberOfMinedNeighbours = 0

            for (const neighbour of neighbours) {
                if (neighbour.classList.contains('cellMined')) {
                    numberOfMinedNeighbours++
                }
            }
            this.textContent = numberOfMinedNeighbours === 0 ? '\xa0' : numberOfMinedNeighbours.toString()

            if (numberOfMinedNeighbours === 0 && !this.classList.contains('cellMined')) {
                for (const neighbour of neighbours) {
                    if (!neighbour.classList.contains('cellExposed')) {
                        await neighbour.click()
                    }
                }
            }
            s._gameStatus = s._checkGameStatus()
        }
    }

    /**
     * @param s {MineSweeper}
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
     * @param cell {HTMLButtonElement}
     */
    _cellEventHandler (cell) {
        const s = this

        cell.addEventListener('click', s._cellFirstsClickHandler.bind(cell, s))
        cell.addEventListener('click', s._cellLeftClickHandler.bind(cell, s))

        cell.addEventListener('contextmenu', async function (e) {
            e.preventDefault()
        })
        cell.addEventListener('contextmenu', s._cellFirstsClickHandler.bind(cell, s))
        cell.addEventListener('contextmenu', s._cellRightClickHandler.bind(cell, s))
    }

    /**
     * @param s {MineSweeper}
     * @this {HTMLButtonElement}
     */
    _smileyClickHandler (s) {
        s._board.innerHTML = ''
        s.init()
    }

    /**
     * @param smiley {HTMLButtonElement}
     */
    _smileyEventHandler (smiley) {
        const s = this

        smiley.addEventListener('click', s._smileyClickHandler.bind(smiley, s))
    }
}
