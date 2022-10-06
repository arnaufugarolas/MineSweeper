window.addEventListener('load', function () {
    onLoad()
    addEvents()
})

function onLoad () {
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
}

function addEvents () {
    document.getElementById('customRandomForm').addEventListener('submit', customRandomForm)

    document.getElementById('customRandomButton').addEventListener('click', function () {
        document.getElementById('customRandomModal').classList.add('open')
    })

    document.getElementById('customRandomClose').addEventListener('click', function () {
        document.getElementById('customRandomModal').classList.remove('open')
    })

    document.getElementById('customMockDataForm').addEventListener('submit', customMockDataForm)

    document.getElementById('customMockDataButton').addEventListener('click', function () {
        document.getElementById('customMockDataModal').classList.add('open')
    })

    document.getElementById('customMockDataClose').addEventListener('click', function () {
        document.getElementById('customMockDataModal').classList.remove('open')
    })
}

function customMockDataForm (e) {
    let data = document.getElementById('customMockDataTextarea').value

    e.preventDefault()
    data = data.replace(/\s/g, '')
    data = data.replace(/^\|/, '')
    data = data.replace(/\|$/, '')
    data = data.replace(/\|\|/g, '^')
    window.location.href = `?mock={${data}}`
}

function customRandomForm (e) {
    const columns = parseInt(document.getElementById('customRandomColumns').value)
    const rows = parseInt(document.getElementById('customRandomRows').value)
    const mines = parseInt(document.getElementById('customRandomMines').value)
    const modal = document.getElementById('customRandomModal')

    e.preventDefault()
    window.location.href = `?random={size=${columns}x${rows},mines=${mines}}`
    modal.classList.remove('open')
}

class MineSweeper {
    constructor (gameOptions) {
        const s = this

        s._board = []
        s._flagsCounter = 0
        s._timer = 0
        s._smiley = ''
        s._gameOptions = gameOptions
    }

    init () {
        const s = this

        s._gameStatus = 'standby'
        clearInterval(s._timer)
        s._createBoard()
    }

    _createBoard () {
        const s = this
        const data = s._gameOptions.get('data')
        s._timer = '0'
        s._smiley = 'bored'

        switch (s._gameOptions.get('boardType')) {
            case 'mock':
                s._board = s._createBoardMockData(data)
                break
            case 'random':
                s._board = s._createBoardRandom(s._dataToOptionsMap(data))
                break
            case 'default':
                break
        }
        s._createBoardCalculateValues(s._board)
        s._printBoardHTML(s._board)
    }

    _createBoardRandom (options) {
        const s = this
        const size = options.get('size').split('x')
        const columnsNumber = parseInt(size[0])
        const rowsNumber = parseInt(size[1])
        const board = []

        for (let i = 0; i < rowsNumber; i++) {
            const row = []

            for (let j = 0; j < columnsNumber; j++) {
                row.push(...new Cell())
            }

            board.push(...[row])
        }
        s._createBoardRandomAddMines(board, options.get('mines'))

        return board
    }

    _createBoardRandomAddMines (board, mines) {
        const s = this
        const rowsNumber = board.length
        const columnsNumber = board[0].length
        s._flagsCounter = mines

        while (mines > 0) {
            const row = Math.floor(Math.random() * rowsNumber)
            const column = Math.floor(Math.random() * columnsNumber)
            const cell = board[row][column]

            if (!cell.mined) {
                cell.mined = true
                mines--
            }
        }
    }

    _dataToOptionsMap (options) {
        const optionsMap = new Map()
        const optionsArray = options.replace(/[{}]/g, '').split(',')

        for (const option of optionsArray) {
            const optionArray = option.split('=')

            optionsMap.set(optionArray[0], optionArray[1])
        }

        return optionsMap
    }

    _createBoardMockData (data) {
        const s = this
        const numberOfMines = 0
        const board = []
        const mockedBoard = data.replace(/[{}]/g, '').split('^')

        for (const row of mockedBoard) {
            mockedBoard[mockedBoard.indexOf(row)] = row.split('')
        }

        for (let i = 0; i < mockedBoard.length; i++) {
            const row = []

            for (let j = 0; j < mockedBoard[0].length; j++) {
                const cell = new Cell()

                if (mockedBoard[i][j].match(/MFQ/)) { cell.mined = true }
                if (mockedBoard[i][j].toUpper === 'F') {
                    cell.tagged = true
                    cell.tag = 'flag'
                } else if (mockedBoard[i][j].toUpper === 'Q') {
                    cell.tagged = true
                    cell.tag = 'question'
                }

                row.push(...[cell])
            }

            board.push(...[row])
        }

        s._flagsCounter = numberOfMines
        return board
    }

    _createBoardCalculateValues (board) {
        for (const row of board) {
            for (const cell of row) {
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (board[board.indexOf(row) + i] !== undefined && board[board.indexOf(row) + i][row.indexOf(cell) + j] !== undefined) {
                            if (board[board.indexOf(row) + i][row.indexOf(cell) + j].mined) {
                                cell.value++
                            }
                        }
                    }
                }
            }
        }
    }

    _printBoardHTML () {
        const s = this

        for (const row of s._board) {
            const rowHTML = document.createElement('tr')
            rowHTML.classList.add('row')
            for (const cell of row) {
                const cellContainerHTML = document.createElement('td')
                const cellHTML = document.createElement('button')
                cellHTML.classList.add('cell')

                cellHTML.addEventListener('click', s._cellExposeEventHandler.bind(cell, s, cellHTML))

                cellContainerHTML.appendChild(cellHTML)
                rowHTML.appendChild(cellContainerHTML)
            }
            document.getElementById('board').appendChild(rowHTML)
        }
    }

    _cellExposeEventHandler (s, cellHTML) {
        const cell = this

        cell.revealed = true
        cellHTML.classList.add('cellExposed')
        cellHTML.textContent = cell.value
        console.log(cell)
    }

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
                s._setSmileyState('sad')
                clearInterval(s._timerInterval)

                return 'lost'
            }
        }

        if (exposedCells.length === numberOfCells - numberOfMines) {
            s._setSmileyState('happy')
            clearInterval(s._timerInterval)
            return 'win'
        }

        return 'playing'
    }

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

/*    _cellFirstsClickHandler (s) {
        if (s._gameStatus === 'standby') {
            s._gameStatus = 'playing'
            s._timerInterval = setInterval(function () {
                s._timer.textContent = (parseInt(s._timer.textContent) + 1).toString()
            }, 1000)
        }
    }

    async _cellLeftClickHandler (s) {
        if (s._gameStatus === 'playing' && !this.classList.contains('cellExposed')) {
            this.classList.add('cellExposed')

            if (this.classList.contains('cellFlagged')) {
                this.classList.remove('cellFlagged')
                s._flagsCounter.textContent = (parseInt(s._flagsCounter.textContent) + 1).toString()
            } else if (this.classList.contains('cellQuestioned')) {
                this.classList.remove('cellQuestioned')
            }

            if (!this.classList.contains('cellMined')) {
                const neighbours = await s._getCellNeighbours(this)
                let numberOfMinedNeighbours = 0

                for (const neighbour of neighbours) {
                    if (neighbour.classList.contains('cellMined')) {
                        numberOfMinedNeighbours++
                    }
                }
                this.textContent = numberOfMinedNeighbours === 0 ? '\xa0' : numberOfMinedNeighbours.toString()

                if (numberOfMinedNeighbours === 0) {
                    for (const neighbour of neighbours) {
                        if (!neighbour.classList.contains('cellExposed')) {
                            await neighbour.click()
                        }
                    }
                }
            }
            s._gameStatus = s._checkGameStatus()
        }
    }

    /!**
         * @param s {MineSweeper}
         * @this {HTMLButtonElement}
         *!/
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

    _smileyClickHandler (s) {
        s._board.innerHTML = ''
        s.init()
    }

    _smileyEventHandler (smiley) {
        const s = this

        smiley.addEventListener('click', s._smileyClickHandler.bind(smiley, s))
    }
        _setSmileyState (state) {
        const s = this

        switch (state) {
            case 'happy':
                s._smiley.src = './images/smiley/happy.png'
                s._smiley.alt = 'Happy'
                break
            case 'sad':
                s._smiley.src = './images/smiley/sad.png'
                s._smiley.alt = 'Sad'
                break
            case 'bored':
                s._smiley.src = './images/smiley/bored.png'
                s._smiley.alt = 'Bored'
                break
        }
    }

    */
}

class Cell {
    constructor () {
        this.mined = false
        this.tagged = false
        this.tag = 'none'
        this.revealed = false
        this.value = 0
    }
}
