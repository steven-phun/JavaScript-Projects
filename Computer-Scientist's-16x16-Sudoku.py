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

# global variables

# 16x16 grid
GRID_SIZE = 16

# 4 boxes per row and column
NUMBER_OF_BOXES = 4

# 0 in grid represents an empty square
EMPTY_SQUARE = 0

# constant variables
WIDTH = 800
HEIGHT = 800

SQUARE_SIZE = WIDTH / GRID_SIZE
HORIZONTAL_SPACE = HEIGHT / GRID_SIZE

WHITE = [255, 255, 255]
BLACK = [0, 0, 0]

# initialize interface object for user
display_surface = pygame.display.set_mode([WIDTH, HEIGHT])

# user's grid to play or solve with
sudoku_grid = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    global sudoku_grid

    if len(sudoku_grid) != GRID_SIZE:
        raise ValueError("given sudoku does not match the 16x16 format")

    for row in range(0, GRID_SIZE):  # represents the 16 rows in grid
        for column in range(0, GRID_SIZE):  # represents the 16 column in grid
            if sudoku_grid[row][column] == EMPTY_SQUARE:  # find first empty square in grid

                for element in range(1, GRID_SIZE + 1):  # generate the numbers to pencil in
                    if safe_to_pencil_element(row, column, element):  # check if element passes constraint
                        sudoku_grid[row][column] = element  # pencil element
                        print_text(element, (column * SQUARE_SIZE + 16, row * SQUARE_SIZE + 2))  # display to GUI

                        if solve_sudoku():  # base case: elements leads to a solution
                            return True
                        else:
                            sudoku_grid[row][column] = EMPTY_SQUARE  # backtrack
                            erase_text(element, (row * SQUARE_SIZE + 16, column * SQUARE_SIZE + 2))  # display to GUI
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


# this method initializes GUI screen for the user to interact with
def setup_screen():
    # set up drawing window
    pygame.font.init()
    pygame.display.set_caption("Computer Scientist's 16x16 Sudoku")

    # set background color
    display_surface.fill(WHITE)

    # set grid lines
    draw_grid_lines()


# helper method draws vertical and horizontal lines for the Sudoku grid
def draw_grid_lines():
    # draw lines for grid
    for i in range(GRID_SIZE + 1):
        # draw outline for boxes
        if i % 4 == 0 and i != 0:
            line_width = 4
        else:
            line_width = 1

        # draw vertical line
        pygame.draw.line(display_surface, BLACK, (i * SQUARE_SIZE, 0), (i * SQUARE_SIZE, WIDTH), line_width)
        # draw horizontal line
        pygame.draw.line(display_surface, BLACK, (0, i * SQUARE_SIZE), (HEIGHT, i * SQUARE_SIZE), line_width)


# @param text        is object to be printed on the screen
# @param position    is the coordinates the user wants the 'text' to be displayed
#
# @post              display the 'text' on coordinates 'position' on the screen
def print_text(text, position):
    # this sudoku starts with 0 instead of 1
    text -= 1

    # convert 10 to A, 11 to B, 12 to C
    if text > 9:
        text += 65 - 10  # ASCII code for A is 65
        text = chr(text)

    font = pygame.font.SysFont('Comic Sans MS', 30)
    text_surface = font.render(str(text), True, BLACK)
    display_surface.blit(text_surface, position)
    pygame.display.update()


# @param text        is object to be erase off the screen
# @param position    is the coordinates the user wants the 'text' to be erase
#
# @post              erase the 'text' on coordinates 'position' off the screen
def erase_text(text, position):
    font = pygame.font.SysFont('Comic Sans MS', 30)
    text_surface = font.render(str(text), True, WHITE)
    display_surface.blit(text_surface, position)
    pygame.display.update()


# this method records the user's key and mouse input
# and displays the input using GUI for the user
def wait_for_user_input():
    pencil = None

    # run until the Sudoku is solved
    input_loop = True
    while input_loop:

        # get user inputs
        for event in pygame.event.get():

            # exit the program
            if event.type == pygame.QUIT:
                input_loop = False

            # click input from user
            if event.type == pygame.MOUSEBUTTONDOWN:
                mouse_position = pygame.mouse.get_pos()

            # key input from user
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_1:
                    print_text("1", mouse_position)

                if event.key == pygame.K_RETURN:
                    solve_sudoku()

        pygame.display.update()


def main():
    setup_screen()
    wait_for_user_input()


main()
pygame.quit()
