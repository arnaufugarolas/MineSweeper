Feature: Minesweeper
  Board symbols style:
  'M' for mine
  'O' for empty
  'F' for flagged mine
  'f' for flagged empty
  'Q' for questioned mine
  'q' for questioned empty
  '^' for row separator
  'H' for hidden cell (not revealed) only to test if the random generator fits the expected distribution and if the cell recursivity works
  'E' for exposed cell (revealed) only to test if cell recursivity works

  The board can be a square or a rectangle
  The minimum size to test is 2x1 and one mine to don't have a automatic win
  Sizes to play:
  8x8 -> 10 mines
  16x16 -> 40 mines
  30x16 -> 99 mines

  Background:
    Given a user opens the app

  @Finished
  Scenario: Default display screen without mock data and without a random map
    Then the value of the remaining flags counter should be: 0
    And the value of the timer should be: 0
    And there shouldn't be any cell in the board

  @Finished
  Scenario: the game loads with mock data
    Given a board generated with this mock data: MOM^MOM^MOM
    Then the board should be
      """
        | M  O  M |
        | M  O  M |
        | M  O  M |
      """

  @Finished
  Scenario: Default display screen with mocked board: remaining flags counter and timer
    Given a board generated with this mock data: MMM^MOM^MOO
    Then the value of the remaining flags counter should be: 6
    And the value of the timer should be: 0

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
  Scenario: the user reveal all the noneMine cells and win the game
    Given a board generated with this mock data: MO
    When the user reveal the cell at: (1, 2)
    Then the game should be won

  Scenario: the user reveal a cell with 0 mines around it
    Given a board generated with this mock data: OOOOO^OOOOO^OOOOM
    When the user reveal the cell at: (2, 2)
    Then the cell at: (2, 2) should have a: void
    And all the cells around: (2, 2) should be revealed

  Scenario: a cell is revealed by a neighbor cell

  Scenario Outline: the user reveal a cell with (1...8) mine around it
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

  Scenario: the user flag a cell
    Given a board generated with this mock data: MO
    When the user flag the cell at: (1, 2)
    Then the cell at: (1, 2) should be flagged

  Scenario: the user remove a flag
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is flagged
    When the user remove the flag from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  Scenario: the user question a cell
    Given a board generated with this mock data: MO
    When the user question the cell at: (1, 2)
    Then the cell at: (1, 2) should be questioned

  Scenario: the user remove a question
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is questioned
    When the user remove the question from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  Scenario: the user reveal a cell that is flagged
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is flagged
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  Scenario: the user reveal a cell that is questioned
    Given a board generated with this mock data: MO
    And the cell at: (1, 2) is questioned
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  Scenario: the user click the smiley to restart the game
    When the user click the smiley
    Then the game should be restarted

  Scenario: the game loads with random generation
    Given a random board of: 8x8
    Then the board should be
      """
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
        | H  H  H  H  H  H  H  H |
      """

  Scenario Outline: Default display screen with random scenarios: remaining flags counter and timer
    Given a random board of: <size>
    Then the value of the remaining flags counter should be: <remainingFlags>
    And the value of the timer should be: 0
    Examples:
      | size  | remainingFlags |
      | 8x8   | 10             |
      | 16x16 | 40             |
      | 30x16 | 99             |

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
