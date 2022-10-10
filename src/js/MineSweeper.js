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
        s._flagsCounter = null
        s._timerInterval = null
        s._smiley = null
        s._gameStatus = null
        s._gameOptions = gameOptions
    }

    init () {
        const s = this
        s._gameStatus = 'standby'

        clearInterval(s._timerInterval)
        s._createBoard()
    }

    _createBoard () {
        const s = this
        const data = s._gameOptions.get('data')

        switch (s._gameOptions.get('boardType')) {
            case 'mock':
                s._board = s._createBoardMockData(data)
                break
            case 'random':
                s._board = s._createBoardRandom(s._dataToOptionsMap(data))
                break
            case 'default':
                s._flagsCounter = 0
                break
        }

        s._timer = 0
        s._smiley = 'bored'
        s._createBoardCalculateValues(s._board)
        s._printBoardHTML(s._board)
    }

    _createBoardRandom (options) {
        const s = this
        const size = options.get('size').split('x')
        const board = []

        for (let i = 0; i < parseInt(size[1]); i++) {
            const row = []

            for (let j = 0; j < parseInt(size[0]); j++) {
                row.push(new Cell([i, j]))
            }

            board.push(...[row])
        }
        s._createBoardRandomAddMines(board, options.get('mines'))

        return board
    }

    _createBoardRandomAddMines (board, mines) {
        const s = this
        s._flagsCounter = mines

        while (mines > 0) {
            const row = Math.floor(Math.random() * board.length)
            const column = Math.floor(Math.random() * board[0].length)
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
        let numberOfMines = 0
        const board = []
        const mockedBoard = data.replace(/[{}]/g, '').split('^')

        for (const row of mockedBoard) {
            mockedBoard[mockedBoard.indexOf(row)] = row.split('')
        }

        for (let i = 0; i < mockedBoard.length; i++) {
            const row = []

            for (let j = 0; j < mockedBoard[0].length; j++) {
                const cell = new Cell([i, j])
                if (mockedBoard[i][j].match(/[MFQ]/)) {
                    numberOfMines++
                    cell.mined = true
                }
                if (mockedBoard[i][j].toUpper === 'F') {
                    cell.tagged = true
                    cell.tag = 'flag'
                } else if (mockedBoard[i][j].toUpper === 'Q') {
                    cell.tagged = true
                    cell.tag = 'question'
                }

                row.push(cell)
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
        const boardHTML = document.getElementById('board')
        const smiley = document.getElementById('smiley')

        boardHTML.innerHTML = ''
        document.getElementById('timer').innerHTML = s._timer
        smiley.addEventListener('click', function () {
            s.init()
        })
        document.getElementById('flagsCounter').innerHTML = s._flagsCounter
        document.getElementById('status').colSpan = s._board[0].length

        switch (s._smiley) {
            case 'happy':
                smiley.src = './images/smiley/happy.png'
                smiley.alt = 'Happy'
                break
            case 'sad':
                smiley.src = './images/smiley/sad.png'
                smiley.alt = 'Sad'
                break
            case 'bored':
                smiley.src = './images/smiley/bored.png'
                smiley.alt = 'Bored'
                break
        }

        for (const row of s._board) {
            const rowHTML = document.createElement('tr')

            rowHTML.classList.add('row')
            for (const cell of row) {
                const cellContainerHTML = document.createElement('td')
                const cellHTML = document.createElement('button')

                cellHTML.classList.add('cell')

                if (cell.revealed) {
                    cellHTML.classList.add('cellExposed')
                    if (cell.mined) {
                        cellHTML.classList.add('cellMined')
                    } else {
                        cellHTML.innerHTML = cell.value > 0 ? cell.value : '\xa0'
                    }
                } else if (cell.tagged) {
                    switch (cell.tag) {
                        case 'flag':
                            cellHTML.classList.add('cellFlagged')
                            break
                        case 'question':
                            cellHTML.classList.add('cellQuestioned')
                            break
                    }
                    cellHTML.classList.add(cell.tag)
                }

                s._cellEventHandler(cell, cellHTML)

                cellContainerHTML.appendChild(cellHTML)
                rowHTML.appendChild(cellContainerHTML)
            }
            boardHTML.appendChild(rowHTML)
        }
    }

    _cellEventHandler (cell, cellHTML, event) {
        const s = this

        cellHTML.addEventListener('click', s._cellFirstActionEventHandler.bind(s))
        cellHTML.addEventListener('click', s._cellExposeEventHandler.bind(cell, s))
        cellHTML.addEventListener('contextmenu', s._cellFirstActionEventHandler.bind(s))
        cellHTML.addEventListener('contextmenu', s._cellTagEventHandler.bind(cell, s))
    }

    /**
     * @this {Cell}
     */
    _cellTagEventHandler (s, e) {
        e.preventDefault()

        if (s._gameStatus === 'playing' && !this.revealed) {
            if (this.tagged) {
                if (this.tag === 'flag') {
                    this.tag = 'question'
                    s._flagsCounter++
                } else {
                    this.tagged = false
                    this.tag = 'none'
                }
            } else {
                this.tagged = true
                this.tag = 'flag'
                s._flagsCounter--
            }
            s._printBoardHTML()
        }
    }

    _cellFirstActionEventHandler () {
        const s = this

        if (s._gameStatus === 'standby') {
            s._gameStatus = 'playing'
            s._timerInterval = setInterval(function () {
                if (s._gameStatus === 'playing') {
                    s._timer++
                    document.getElementById('timer').innerHTML = s._timer
                } else {
                    clearInterval(s._timerInterval)
                }
            }, 1000)
        }
    }

    /**
     * @this {Cell}
     */
    _cellExposeEventHandler (s) {
        const cell = this

        if (s._gameStatus === 'playing') {
            if (cell.mined) {
                s._gameStatus = 'lost'
                for (const row of s._board) {
                    for (const cell of row) {
                        if (cell.mined) {
                            cell.revealed = true
                        }
                    }
                }
            }
            s._cellExpose(cell)
            s._checkGameStatus()
            s._printBoardHTML()
        }
    }

    _cellExpose (cell) {
        const s = this
        cell.revealed = true
        if (cell.value !== 0 || cell.mined) {
            return
        }

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (cell.cords[0] + i >= 0 && cell.cords[0] + i < s._board.length) {
                    if (cell.cords[1] + j >= 0 && cell.cords[1] + j < s._board[0].length) {
                        const neighbour = s._board[cell.cords[0] + i][cell.cords[1] + j]

                        if (!neighbour.revealed) {
                            neighbour.revealed = true
                            s._cellExpose(neighbour)
                        }
                    }
                }
            }
        }
    }

    _checkGameStatus () {
        const s = this
        const exposedCells = []
        const minedCells = []
        let numberOfCells = 0

        for (const row of s._board) {
            for (const cell of row) {
                if (cell.revealed) {
                    exposedCells.push(...[cell])
                }
                if (cell.mined) {
                    minedCells.push(...[cell])
                }
                numberOfCells++
            }
        }

        for (const mine of minedCells) {
            if (mine.revealed) {
                s._smiley = 'sad'
                clearInterval(s._timerInterval)
                return 'lost'
            }
        }

        if (exposedCells.length === numberOfCells - minedCells.length) {
            s._smiley = 'happy'
            clearInterval(s._timerInterval)
            return 'win'
        }

        return 'playing'
    }
}

class Cell {
    constructor (cords) {
        this.cords = cords
        this.mined = false
        this.tagged = false
        this.tag = 'none'
        this.revealed = false
        this.value = 0
    }
}
