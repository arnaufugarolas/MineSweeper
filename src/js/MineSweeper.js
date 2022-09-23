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
        const boardHtml = document.getElementById('board')

        for (const row of rows) {
            const tr = document.createElement('tr')
            tr.setAttribute('class', 'row')

            for (const column of row) {
                const cell = document.createElement('td').appendChild(document.createElement('button'))
                let classList = 'cell'
                if (column === 'M') {
                    classList += ' cellMined'
                }
                cell.setAttribute('class', classList)
                cell.textContent = '\xa0'
                tr.appendChild(cell)
            }
            boardHtml.appendChild(tr)
        }
    }
}
