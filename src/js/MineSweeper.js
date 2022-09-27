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
        this._gameOptions = gameOptions
        this._game = document.getElementById('mineSweeper')
        this._board = this._game.getElementById('board')
        this._flagsCounter = this._game.getElementById('flagsCounter')
    }

    init () {
        this._createBoard()
    }

    _createBoard () {
        const boardType = this._gameOptions.get('boardType')
        const data = this._gameOptions.get('data')

        switch (boardType) {
            case 'mock':
                this._createBoardFromMockData(data)
                break
        }
    }

    _createBoardFromMockData (data) {
        const rows = data.split('^')
        let numberOfMines = 0

        for (const row of rows) {
            const tr = document.createElement('tr')
            tr.setAttribute('class', 'row')

            for (const column of row) {
                const cell = document.createElement('td').appendChild(document.createElement('button'))
                let classList = 'cell'
                if (column === 'M') {
                    classList += ' cellMined'
                    numberOfMines++
                }
                cell.setAttribute('class', classList)
                cell.textContent = '\xa0'
                tr.appendChild(cell)
            }
            this._board.appendChild(tr)
        }
        this._flagsCounter.textContent = numberOfMines.toString()
    }
}
