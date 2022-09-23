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

  Scenario: the game loads with mock data
    Given a board like: MOM^MOM^MOM
    Then the board should be
      """
        | M  O  M |
        | M  O  M |
        | M  O  M |
      """

  Scenario: Default display screen with mocked board: remaining flags counter and timer
    Given a board like: MMM^MOM^MOO
    Then the value of the remaining flags counter should be: 6
    And the value of the timer should be: 0

  Scenario: Default display screen with mocked board: cells states
    Given a board like: MMM^MOM^MOO
    Then no cells should be exposed
    And no cells should be flagged
    And no cells should be questioned

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

  Scenario: the user reveal a cell that is a mine and lose the game
    Given a board like: MO
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) should be a mine
    And the game should be lost

  Scenario: the user reveal all the noneMine cells and win the game
    Given a board like: MO
    When the user reveal the cell at: (1, 2)
    Then the game should be won

  Scenario: the user reveal a cell with 0 mines around it
    Given a board like: OOOOO^OOOOO^OOOOM
    When the user reveal the cell at: (2, 2)
    Then the cell at: (2, 2) should have a: void
    And all the cells around: (2, 2) should be revealed

  Scenario: A cell with 0 mines around it reveal the cells around it recursively only if they have 0 mines around them
    Given a board like:
      """
        | O  O  O  O  O |
        | O  O  O  O  O |
        | O  O  O  O  O |
        | O  O  O  O  O |
        | O  O  O  M  O |
        | O  O  O  O  O |
      """
    When the user reveal the cell at: (2, 2)
    Then the board should be
      """
        | E  E  E  E  E |
        | E  E  E  E  E |
        | E  E  E  E  E |
        | E  E  E  E  E |
        | E  E  E  M  H |
        | E  E  E  H  H |
      """

  Scenario Outline: the user reveal a cell with (1...8) mine around it
    Given a board like: <board>
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
    Given a board like: MO
    When the user flag the cell at: (1, 2)
    Then the cell at: (1, 2) should be flagged

  Scenario: the user remove a flag
    Given a board like: MO
    And the cell at: (1, 2) is flagged
    When the user remove the flag from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  Scenario: the user question a cell
    Given a board like: MO
    When the user question the cell at: (1, 2)
    Then the cell at: (1, 2) should be questioned

  Scenario: the user remove a question
    Given a board like: MO
    And the cell at: (1, 2) is questioned
    When the user remove the question from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  Scenario: the user reveal a cell that is flagged
    Given a board like: MO
    And the cell at: (1, 2) is flagged
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be flagged

  Scenario: the user reveal a cell that is questioned
    Given a board like: MO
    And the cell at: (1, 2) is questioned
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  Scenario: the user click the smiley to restart the game
    When the user click the smiley
    Then the game should be restarted