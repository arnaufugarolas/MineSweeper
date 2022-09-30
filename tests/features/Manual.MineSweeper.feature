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

  Scenario: the user click a cell and the timer starts
    Given a board generated with this mock data: MOMO^OMOM^MOMO
    When the user reveal the cell at: (1, 1)
    Then the value of the timer should be: 1
