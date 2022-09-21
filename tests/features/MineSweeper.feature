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

  Scenario: Default display screen
    Then the value of the timer should be: 0
    And the value of the flags counter should be: 10
    And no cells should be exposed
    And no cells should be flagged
    And no cells should be questioned

  Scenario Outline: the user revel a cell
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    Examples:
      | board | y | x |
      | MO    | 0 | 1 |

  Scenario Outline: the user reveal a cell that is a mine and lose the game
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    Then the cell at: (<y>, <x>) should be a mine
    And the game should be lost
    Examples:
      | board | y | x |
      | MO    | 0 | 0 |

  Scenario Outline: the user reveal all the noneMine cells and win the game
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the game should be won
    Examples:
      | board | y | x |
      | MO    | 0 | 1 |

  Scenario Outline: the user reveal a cell with 0 mine around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: &nbsp;
    And all the cells around: (<y>, <x>) should be revealed
    Examples:
      | board       | y | x |
      | OOO^OOO^OOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 1 mine around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 1
    Examples:
      | board       | y | x |
      | MOO^OOO^OOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 2 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 2
    Examples:
      | board       | y | x |
      | MMO^OOO^OOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 3 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 3
    Examples:
      | board       | y | x |
      | MMM^OOO^OOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 4 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 4
    Examples:
      | board       | y | x |
      | MMM^MOO^OOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 5 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 5
    Examples:
      | board       | y | x |
      | MMM^MOM^OOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 6 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 6
    Examples:
      | board       | y | x |
      | MMM^MOM^MOO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 7 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 7
    Examples:
      | board       | y | x |
      | MMM^MOM^MMO | 1 | 1 |

  Scenario Outline: the user reveal a cell with 8 mines around it
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 8
    Examples:
      | board       | y | x |
      | MMM^MOM^MMM | 1 | 1 |

  Scenario Outline: the user flag a cell
    Given a board like: <board>
    When the user flag the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be flagged
    Examples:
      | board | y | x |
      | MO    | 0 | 1 |

  Scenario Outline: the user remove a flag
    Given a board like: <board>
    When the user remove the flag from the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be unFlagged
    Examples:
      | board | y | x |
      | Mf    | 0 | 1 |

  Scenario Outline: the user question a cell
    Given a board like: <board>
    When the user question the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be questioned
    Examples:
      | board | y | x |
      | MO    | 0 | 1 |

  Scenario Outline: the user remove a question
    Given a board like: <board>
    When the user remove the question from the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) shouldn't be questioned
    Examples:
      | board | y | x |
      | Mq    | 0 | 1 |

  Scenario: the user click the smiley to restart the game
    When the user click the smiley
    Then the game should be restarted

  Scenario Outline: the user reveal a cell that is flagged
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) shouldn't be flagged
    Examples:
      | board | y | x |
      | Mf    | 0 | 1 |

  Scenario Outline: the user reveal a cell that is questioned
    Given a board like: <board>
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) shouldn't be questioned
    Examples:
      | board | y | x |
      | Mq    | 0 | 1 |
