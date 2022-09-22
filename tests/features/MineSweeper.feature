Feature: Minesweeper
  Board symbols style:
  'M' for mine
  'O' for empty
  'F' for flagged mine
  'f' for flagged empty
  'Q' for questioned mine
  'q' for questioned empty
  '^' for row separator

  The board can be a square or a rectangle
  The minimum size to test is 2x1 and one mine to don't have a automatic win
  Sizes to play:
  8x8 -> 10 mines
  16x16 -> 40 mines
  30x16 -> 99 mines

  Background:
    Given a user opens the app

  Scenario: Default game status bar
    When the user opens the app
    Then the value of the remaining flags counter should be: <remainingFlags>
    And the value of the timer should be: 0

  Scenario Outline: Default display screen: remaining flags counter and timer
    When the user starts a new game with a board like: <board>
    Then the value of the remaining flags counter should be: <remainingFlags>
    And the value of the timer should be: 0
    Examples:
      | board | remainingFlags |
      | 8x8   | 10             |
      | 16x16 | 40             |
      | 30x16 | 99             |

  Scenario Outline: Default display screen with random scenarios
    When the user starts a new game with a random board of: <size>
    Then the value of the remaining flags counter should be: <remainingFlags>
    And the value of the timer should be: 0
    And no cells should be exposed
    And no cells should be flagged
    And no cells should be questioned
    Examples:
      | size  | remainingFlags |
      | 8x8   | 10    |
      | 16x16 | 40    |
      | 30x16 | 99    |

  Scenario: the user revel a cell
    Given a board like: MO
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) should be revealed

  Scenario: the user reveal a cell that is a mine and lose the game
    Given a board like: MO
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) should be a mine
    And the game should be lost

  Scenario: the user reveal all the noneMine cells and win the game
    Given a board like: MO
    When the user reveal the cell at: (1, 2)
    Then the game should be won

  Scenario: the user reveal a cell with 0 mine around it
    Given a board like: OOO^OOO^OOO
    When the user reveal the cell at: (2, 2)
    Then the cell at: (2, 2) should have a: void
    And all the cells around: (2, 2) should be revealed

  Scenario Outline: the user reveal a cell with (1...8) mine around it
    Given a board like: <board>
    When the user reveal the cell at: (<row>, <column>)
    Then the cell at: (<row>, <column>) should have a: <mines>
    Examples:
      | board       | row | column | mines |
      | MOO^OOO^OOO | 2   | 2      | 1     |
      | MMO^OOO^OOO | 2   | 2      | 2     |
      | MMM^OOO^OOO | 2   | 2      | 3     |
      | MMM^MOO^OOO | 2   | 2      | 4     |
      | MMM^MOM^OOO | 2   | 2      | 5     |
      | MMM^MOM^MOO | 2   | 2      | 6     |
      | MMM^MOM^MMO | 2   | 2      | 7     |
      | MMM^MOM^MMM | 2   | 2      | 8     |

  Scenario: the user flag a cell
    Given a board like: MO
    When the user flag the cell at: (1, 2)
    Then the cell at: (1, 2) should be flagged

  Scenario: the user remove a flag
    Given a board like: MO
    And the cell at: (1, 2) is flagged
    When the user remove the flag from the cell at: (1, 2)
    Then the cell at: (1, 2) should be unFlagged

  Scenario: the user question a cell
    Given a board like: MO
    When the user question the cell at: (1, 2)
    Then the cell at: (1, 2) should be questioned

  Scenario: the user remove a question
    Given a board like: MO
    And the cell at: (1, 2) is questioned
    When the user remove the question from the cell at: (1, 2)
    Then the cell at: (1, 2) shouldn't be questioned

  Scenario: the user click the smiley to restart the game
    When the user click the smiley
    Then the game should be restarted

  Scenario: the user reveal a cell that is flagged
    Given a board like: MO
    And the cell at: (1, 2) is flagged
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) should be revealed
    And the cell at: (1, 2) shouldn't be flagged


  Scenario: the user reveal a cell that is questioned
    Given a board like: MO
    And the cell at: (1, 2) is questioned
    When the user reveal the cell at: (1, 2)
    Then the cell at: (1, 2) should be revealed
    And the cell at: (1, 2) shouldn't be questioned
