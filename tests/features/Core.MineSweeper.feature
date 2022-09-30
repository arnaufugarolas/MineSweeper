Feature: Minesweeper
  Board symbols style:
  'M' for mine
  'O' for empty unexposed cell
  'F' for flagged mine
  'f' for flagged empty
  'Q' for questioned mine
  'q' for questioned empty
  'H' for unexposed cell
  '0' to '8' exposed cell without mine shows the number of mines around the cell
  '^' for row separator
  '|' for row separator

  The board can be a square or a rectangle
  The minimum size is 2x1 and one mine to don't have a automatic win

  Sizes to play:
  8x8 -> 10 mines
  16x16 -> 40 mines
  30x16 -> 99 mines

  @Finished
  Scenario: Default display screen: no mock data and no a random map the board shouldn't have cells
    Given a user opens the app
    Then there shouldn't be any cell in the board

  @Finished
  Scenario: Default display screen: no mock data and no a random map the remaining flags counter should be 0
    Given a user opens the app
    Then the value of the remaining flags counter should be: 0

  @Finished
  Scenario: Default display screen: no mock data and no a random map the timer value should be 0 because the user hasn't started the game
    Given a user opens the app
    Then the value of the timer should be: 0

  @Finished
  Scenario: Default display screen: with mocked board: the remaining flags counter should be the number of mines
    Given a board generated with this mock data: MMM^MOM^MOO
    Then the value of the remaining flags counter should be: 6

  @Finished
  Scenario: Default display screen: with mocked board: the timer value should be 0 because the user hasn't started the game
    Given a board generated with this mock data: MO
    Then the value of the timer should be: 0

  @Finished
  Scenario: Default display screen with mocked board: cells states
    Given a board generated with this mock data: MMM^MOM^MOO
    Then no cells should be exposed
    And no cells should be flagged
    And no cells should be questioned

  @Finished
  Scenario: the user reveal a cell that is a mine and lose the game
    Given a board generated with this mock data: MO
    When the user reveal the cell at: (1, 1)
    Then the game should be lost

  @Finished
  Scenario: the user reveal a cell that is a mine and lose the game: all the mines should blown up
    Given a board generated with this mock data: MOMO^OMOM^MOMO
    When the user reveal the cell at: (1, 1)
    Then All the mines should be blown up

  @Finished
  Scenario: the user reveal a cell that is a mine and lose the game: the user can't reveal any other cell
    Given a board generated with this mock data: MOMO^OMOM^MOMO
    When the user reveal the cell at: (1, 1)
    And the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be revealed

  @Finished
  Scenario: the user reveal a cell that is a mine and lose the game: the user can't flag a cell
    Given a board generated with this mock data: MOMO^OMOM^MOMO
    When the user reveal the cell at: (1, 1)
    And the user flag the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  @Finished
  Scenario: the user reveal a cell that is a mine and lose the game: the user can't question a cell
    Given a board generated with this mock data: MOMO^OMOM^MOMO
    When the user reveal the cell at: (1, 1)
    And the user question the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  @Finished
  Scenario: the user reveal all the noneMine cells and win the game
    Given a board generated with this mock data: MO
    When the user reveal the cell at: (1, 2)
    Then the game should be won

  @Finished
  Scenario Outline: the user reveal a cell with (1..8) mine around it
    Given a board generated with this mock data: <board>
    When the user reveal the cell at: (2, 2)
    Then the cell at: (2, 2) should have a: <minesAround>
    Examples:
      | board       | minesAround |
      | MOO^OOO^OOO | 1           |
      | MMO^OOO^OOO | 2           |
      | MMM^OOO^OOO | 3           |
      | MMM^MOO^OOO | 4           |
      | MMM^MOM^OOO | 5           |
      | MMM^MOM^MOO | 6           |
      | MMM^MOM^MMO | 7           |
      | MMM^MOM^MMM | 8           |

  @Finished
  Scenario: the user reveal a cell with 0 mines around it and its not a mine, is an empty cell
    Given a board generated with this mock data: OOOO^OOOO^OOOM
    When the user reveal the cell at: (2, 2)
    Then the cell at: (2, 2) should have a: void

  @Finished
  Scenario: the user reveal an empty cell, the cells around it should be revealed
    Given a board generated with this mock data: OOOO^OOOO^OOOM
    When the user reveal the cell at: (2, 2)
    Then  all the cells around: (2, 2) should be revealed

  @Finished
  Scenario: a cell that is an empty cell with 0 mines around it is revealed by a neighbor cell
    Given a board generated with this mock data: OOOOO^OOOOO^OOOOM^OOOOO
    When the user reveal the cell at: (2, 2)
    Then the board should be:
    """
      | 0  0  0  0  0 |
      | 0  0  0  1  1 |
      | 0  0  0  1  H |
      | 0  0  0  1  H |
    """

  @Finished
  Scenario: the user do the firsts click action (reveal, flag or question a cell), the timer should start counting
    Given a board generated with this mock data: OMO
    When the user reveal the cell at: (1, 1)
    And the user wait 2 seconds
    Then the value of the timer should be: 2

  @Finished
  Scenario: the user flag a cell
    Given a board generated with this mock data: MO
    When the user flag the cell at: (1, 2)
    Then the cell at: (1, 2) should be flagged

  @Finished
  Scenario: the user remove a flag
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is flagged
    When the user remove the flag from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  @Finished
  Scenario: the user reveal a cell that is flagged
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is flagged
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  @Finished
  Scenario: the user flag a cell and the remaining flags counter decreases
    Given a board generated with this mock data: MOMO
    When the user flag the cell at: (1, 2)
    Then the value of the remaining flags counter should be: 1

  @Finished
  Scenario: the user remove a flag from a cell and the remaining flags counter increases
    Given a board generated with this mock data: MOMO
    And the cell at: (1, 2) is flagged
    When the user remove the flag from the cell at: (1, 2)
    Then the value of the remaining flags counter should be: 2

  @Finished
  Scenario: the user question a cell
    Given a board generated with this mock data: MO
    When the user question the cell at: (1, 2)
    Then the cell at: (1, 2) should be questioned

  @Finished
  Scenario: the user remove a question
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is questioned
    When the user remove the question from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  @Finished
  Scenario: the user reveal a cell that is questioned
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is questioned
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  @Finished
  Scenario: the user question a cell and the remaining flags counter doesn't change
    Given a board generated with this mock data: MOMO
    When the user question the cell at: (1, 2)
    Then the value of the remaining flags counter should be: 2

  @Finished
  Scenario: the user remove a question from a cell and the remaining flags counter doesn't change
    Given a board generated with this mock data: MOMO
    And the cell at: (1, 2) is questioned
    When the user remove the question from the cell at: (1, 2)
    Then the value of the remaining flags counter should be: 2

  @Finished
  Scenario: the user click the smiley to restart the game
    Given a user opens the app
    When the user click the smiley
    Then the game should be restarted

  @TODO #TODO When the user clicks the smiley the game should be restarted and no cells should be revealed
  Scenario: the user click the smiley to restart the game: all the cells should be hidden
    Given a board generated with this mock data: MOMO
    When the user click the smiley
    Then no cells should be exposed

  @TODO #TODO When the user clicks the smiley the game should be restarted and no cells should be flagged
  Scenario: the user click the smiley to restart the game: no cells should be flagged
    Given a board generated with this mock data: MOMO
    When the user click the smiley
    Then no cells should be flagged

  @TODO #TODO When the user clicks the smiley the game should be restarted and no cells should be questioned
  Scenario: the user click the smiley to restart the game: no cells should be questioned
    Given a board generated with this mock data: MOMO
    When the user click the smiley
    Then no cells should be questioned

  @TODO #TODO When the user clicks the smiley the game should be restarted and the timer should be reset
  Scenario: the user click the smiley to restart the game: the timer should be reset
    Given a board generated with this mock data: MOMO
    When the user reveal the cell at: (1, 2)
    And the user wait 5 seconds
    And the user click the smiley
    Then the value of the timer should be: 0

  @TODO #TODO Create a scenario that check the length of the board and of the rows
  Scenario: the game loads with random generation the board should have the correct length
    Given a random board of: 8x8
    Then the board should have: 8 rows
    And the board should have: 8 columns for each row

  @TODO #TODO The remaining flags counter should be the number of mines
  Scenario Outline: Default display screen with random scenarios: the remaining flags counter should be the number of mines
    Given a random board of: <size>
    Then the value of the remaining flags counter should be: <remainingFlags>
    Examples:
      | size  | remainingFlags |
      | 8x8   | 10             |
      | 16x16 | 40             |
      | 30x16 | 99             |

  @TODO #TODO The timer should be 0
  Scenario: Default display screen with random scenarios: timer should be 0
    Given a random board of: <size>
    Then the value of the timer should be: 0

  @TODO #TODO All the cells should be hidden and not flagged or questioned
  Scenario Outline: Default display screen with random scenarios: cells states
    Given a random board of: <size>
    Then no cells should be exposed
    And no cells should be flagged
    And no cells should be questioned
    Examples:
      | size  |
      | 8x8   |
      | 16x16 |
      | 30x16 |
