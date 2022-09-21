Feature: Minesweeper

  Background:
    Given a user opens the app

  Scenario: Default display screen
    Then the value of the timer should be: 0
    And the value of the flags counter should be: 10
    And no cells should be exposed
    And no cells should be flagged
    And no cells should be questioned

  Scenario: the user revel a cell
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed

  Scenario: the user reveal a cell that is a mine and lose the game
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    Then the cell at: (<y>, <x>) should be a mine
    And the game should be lost

  Scenario: the user reveal all the noneMine cells and win the game
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the game should be won

  Scenario: the user reveal a cell with 0 mine around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: &nbsp;
    And all the cells around: (<y>, <x>) should be revealed

  Scenario: the user reveal a cell with 1 mine around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 1

  Scenario: the user reveal a cell with 2 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 2

  Scenario: the user reveal a cell with 3 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 3

  Scenario: the user reveal a cell with 4 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 4

  Scenario: the user reveal a cell with 5 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 5

  Scenario: the user reveal a cell with 6 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 6

  Scenario: the user reveal a cell with 7 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 7

  Scenario: the user reveal a cell with 8 mines around it
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) should have a: 8

  Scenario: the user flag a cell
    When the user flag the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be flagged

  Scenario: the user remove a flag
    When the user remove the flag from the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be unFlagged

  Scenario: the user question a cell
    When the user question the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be questioned

  Scenario: the user remove a question
    When the user remove the question from the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) shouldn't be questioned

  Scenario: the user click the smiley to restart the game
    When the user click the smiley
    Then the game should be restarted

  Scenario: the user reveal a cell that is flagged
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) shouldn't be flagged

  Scenario: the user reveal a cell that is questioned
    When the user reveal the cell at: (<y>, <x>)
    Then the cell at: (<y>, <x>) should be revealed
    And the cell at: (<y>, <x>) shouldn't be questioned
