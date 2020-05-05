import pygame

##
# created by Steven Phun on May 5, 2020.
#
#
# this GUI python program   allows the user to play or have the program solve a 16x16 Sudoku.
#                           the game is based on the classic 9x9 Sudoku where the basic rules is the same.
#                           place the numbers 0-9 and letters A-F into each row, column and 4x4 row once.
#
# -sudoku                   is a partially completed grid.
# -grid                     has 16 rows, 16 columns, and 16 boxes, each having 16 squares (256 total).
# -constraint               is that each element(numbers/letters) appears only once in each row, column, and row.
# -pencil                   write a number or letter in the square.
#
# grid layout in code
#
#                              0  1  2  3    4  5  6  7    8  9  10 11   12 14 15 16
#                            +------------++------------++------------++------------+
#                         0  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         1  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         2  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         3  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                            +------------++------------++------------++------------+
#                         4  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         5  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         6  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         7  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                            +------------++------------++------------++------------+
#                         8  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         9  | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         10 | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         11 | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                            +------------++------------++------------++------------+
#                         12 | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         14 | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         15 | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                         16 | ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? || ?  ?  ?  ? |
#                            +------------++------------++------------++------------+
##


# 16x16 grid
GRID_SIZE = 16

# 4 boxes per row and column
NUMBER_OF_BOXES = 4

# 0 in grid represents an empty square
EMPTY_SQUARE = 0

# user's grid to play or solve with
sudoku_grid = [[5, 11, 12, 8, 4, 16, 7, 3, 2, 13, 9, 10, 6, 14, 15, 1],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]


# @post                 solve and print the solution to the given Sudoku
#                       by using backtracking recursion
#
# @raise                ValueError if given grid is invalid
# @return               true, if a solution is found
def solve_sudoku():
    if len(sudoku_grid) != GRID_SIZE:
        raise ValueError("given sudoku does not match the 16x16 format")

    for row in range(0, GRID_SIZE):  # represents the 16 rows in grid
        for column in range(0, GRID_SIZE):  # represents the 16 column in grid
            if sudoku_grid[row][column] == EMPTY_SQUARE:  # find first empty square in grid

                for element in range(1, GRID_SIZE + 1):  # generate the numbers to pencil in
                    if safe_to_pencil_element(row, column, element):  # check if element passes constraint
                        sudoku_grid[row][column] = element  # pencil element

                        if solve_sudoku():  # base case: elements leads to a solution
                            return True
                        else:
                            sudoku_grid[row][column] = EMPTY_SQUARE  # backtrack

                return False  # sudoku has no solution
    return True  # sudoku solved


# @param        row and column represents the position of the column in the grid.
# @param        element is the element being penciled in
#
# @return      true, if the given element does not exists in the same row, column, and row.
def safe_to_pencil_element(row, column, element):
    return not (rows_contain_element(row, element) or
                columns_contain_element(column, element) or
                boxes_contain_element(row, column, element))


# @param        row represents the position of the row in the grid.
# @param        element is the number or letter to pencil
#
# @return      false, if the row does not contain the element
def rows_contain_element(row, element):
    for column in range(0, GRID_SIZE):
        if sudoku_grid[row][column] == element:
            return True

    return False


# @param        column represents the position of the column in the grid.
# @param        element is the number or letter to pencil
#
# @return      false, if the row does not contain the element
def columns_contain_element(column, element):
    for row in range(0, GRID_SIZE):
        if sudoku_grid[row][column] == element:
            return True

    return False


# @param        row and column represents the row and column position in the grid.
# @param        element is the element being penciled in
#
# @return      false, if the row does not contain the element
def boxes_contain_element(row, column, element):
    # find box with given row and column
    row_box_number = row - row % NUMBER_OF_BOXES
    column_box_number = column - column % NUMBER_OF_BOXES

    for box in range(row_box_number, row_box_number + NUMBER_OF_BOXES):
        for square in range(column_box_number, column_box_number + NUMBER_OF_BOXES):
            if sudoku_grid[box][square] == element:
                return True

    return False


# constant variables
WIDTH = 800
HEIGHT = 800

VERTICAL_SPACE = WIDTH / GRID_SIZE
HORIZONTAL_SPACE = HEIGHT / GRID_SIZE

WHITE = [255, 255, 255]
BLACK = [0, 0, 0]


# initialize GUI screen
def setup_screen():
    # set up drawing window
    pygame.init()
    pygame.display.set_caption("Computer Scientist's 16x16 Sudoku")

    # set screen size
    surface = pygame.display.set_mode([WIDTH, HEIGHT])

    # set background color
    surface.fill(WHITE)

    draw_grid_lines(surface)


# draw vertical and horizontal lines for the grid
def draw_grid_lines(surface):
    # draw lines for grid
    for i in range(GRID_SIZE + 1):
        if i % 4 == 0 and i != 0:
            line_width = 4
        else:
            line_width = 1

        # vertical line
        pygame.draw.line(surface, BLACK, (i * VERTICAL_SPACE, 0), (i * VERTICAL_SPACE, WIDTH), line_width)
        # horizontal line
        pygame.draw.line(surface, BLACK, (0, i * VERTICAL_SPACE), (HEIGHT, i * VERTICAL_SPACE), line_width)


def main():
    setup_screen()

    # run until the Sudoku is solved
    run = True
    while run:

        # get user inputs
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False

        pygame.display.update()


main()
pygame.quit()
