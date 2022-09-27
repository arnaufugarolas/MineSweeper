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
                cell.classList.add('cell')
                if (column === 'M') {
                    cell.classList.add('cellMined')
                    numberOfMines++
                }
                cell.textContent = '\xa0'
                cell.addEventListener('click', function () {
                    const gameStatus = s._checkGameStatus()
                    if (gameStatus === 'playing' && !this.classList.contains('cellExposed')) {
                        this.classList.add('cellExposed')
                    }
                    s._checkGameStatus()
                })
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
}
