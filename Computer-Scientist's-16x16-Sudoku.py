import pygame
import time

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
# -setter                   fixed number of letters that cannot be erased
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
EMPTY_SQUARE = None

# constant variables
WIDTH = 800
HEIGHT = 800
LEGEND_HEIGHT = 150

SQUARE_SIZE = WIDTH / GRID_SIZE
HORIZONTAL_SPACE = HEIGHT / GRID_SIZE

# values to add to center text in square
CENTER_X = GRID_SIZE
CENTER_Y = 2

WHITE = [255, 255, 255]
BLACK = [0, 0, 0]
BLUE = [0, 0, 255]
RED = [255, 0, 0]
GREY = [192, 192, 192]

# initialize interface object for user
display_surface = pygame.display.set_mode([WIDTH, HEIGHT + LEGEND_HEIGHT])

START_WITH_0 = True

# user's grid to play or solve with
sudoku_grid = [[14, 15, 4, 9, 3, 7, 10, 5, 6, 8, 12, 11, 0, 1, 13, 2],
               [7, 6, 11, 8, 2, 4, 14, 13, 10, 1, 9, 0, 15, 5, 12, 3],
               [0, 10, None, 5, 1, 11, 8, 12, None, 2, 15, 13, 7, 6, 4, 9],
               [13, 12, 1, 2, 15, 10, 6, 0, 3, 5, 4, 7, 10, 14, 8, 11],
               [1, 11, 8, 7, 12, 6, 5, 10, 9, 14, 13, 4, None, 0, 3, 15],
               [5, 2, 15, 13, 14, 0, None, 3, 12, 7, 1, 10, 8, 4, 9, 6],
               [4, 9, 14, 10, 8, 15, 1, 7, 2, 0, 3, 6, 5, 13, 11, 12],
               [6, 3, 0, 13, 9, 13, 2, 4, 8, 15, 11, 5, 14, 10, 7, 1],
               [2, 4, 12, 11, 5, 1, 0, 9, 13, 10, 6, 14, 3, 8, 15, 7],
               [10, 5, None, 0, 11, 12, 7, 15, 4, 3, 2, 8, 6, 9, 1, 14],
               [15, 8, 7, 1, 6, 3, 4, 14, 0, 11, 5, 9, None, None, None, None],
               [9, 14, 6, 3, 10, 8, 13, 2, 15, 12, 7, 1, None, None, None, None],
               [12, 0, 5, 6, 4, 2, 3, 1, 11, 9, 10, 15, None, None, None, None],
               [11, 7, 2, 15, 0, 10, 9, 8, 5, 13, 14, 12, None, None, None, None],
               [3, 1, 10, 4, 13, 14, 12, 11, 7, 6, 8, 2, None, None, None, None],
               [8, 13, 9, 14, 7, 5, 15, 6, 1, 4, 0, 3, None, None, None, None]]


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

                for element in range(0, GRID_SIZE):  # generate the numbers to pencil in
                    if safe_to_pencil_element(row, column, element):  # check if element passes constraint
                        sudoku_grid[row][column] = element  # pencil element
                        print_text(element, (column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y), BLACK)

                        if solve_sudoku():  # base case: elements leads to a solution
                            return True
                        else:
                            sudoku_grid[row][column] = EMPTY_SQUARE  # backtrack
                            erase(column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y)
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

    # display setters
    draw_setter()

    # display key map
    display_legend()


# helper method draws vertical and horizontal lines for the Sudoku grid
def draw_grid_lines():
    # draw lines for grid
    for i in range(GRID_SIZE + 1):
        # draw outline for boxes
        if i % NUMBER_OF_BOXES == 0 and i != 0:
            line_width = 2
        else:
            line_width = 1

        # draw vertical line
        pygame.draw.line(display_surface, BLACK, (i * SQUARE_SIZE, 0), (i * SQUARE_SIZE, WIDTH), line_width)
        # draw horizontal line
        pygame.draw.line(display_surface, BLACK, (0, i * SQUARE_SIZE), (HEIGHT, i * SQUARE_SIZE), line_width)


# @post display the fixed numbers and letters of the grid
def draw_setter():
    global START_WITH_0
    for row in range(0, GRID_SIZE):
        for column in range(0, GRID_SIZE):
            if sudoku_grid[row][column] != EMPTY_SQUARE:
                print_text(sudoku_grid[row][column],
                           (column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y), BLUE)
    START_WITH_0 = True


# @param text        is object to be printed on the screen
# @param position    is the coordinates the user wants the 'text' to be displayed
#
# @post              display the 'text' on coordinates 'position' on the screen
def print_text(text, position, color):
    if isinstance(text, int):
        if not START_WITH_0:
            text -= 1
        # convert 10 to A, 11 to B, 12 to C
        if text > 9:
            text += 65 - 10  # ASCII code for A is 65
            text = chr(text)

    font = pygame.font.SysFont('Comic Sans MS', 30)
    text_surface = font.render(str(text), True, color)
    display_surface.blit(text_surface, position)
    pygame.display.update()


# @post erase element in square by drawing a white rectangle over it
def erase(x, y):
    pygame.draw.rect(display_surface, WHITE, (x, y, SQUARE_SIZE - CENTER_X, SQUARE_SIZE - CENTER_Y), 0)


def display_legend():
    print_text("To pencil 'Click' square then 'Key' the element", (0, WIDTH), BLACK)
    print_text("To guess 'Pencil' element then press 'Tab'", (0, WIDTH + 35), BLACK)
    print_text("To erase 'Click' square then press 'Del'", (0, WIDTH + 35 * 2), BLACK)
    print_text("To solve press 'Enter'", (0, WIDTH + 35 * 3), BLACK)


# this method records the user's key and mouse input
# and displays the input using GUI for the user
def wait_for_user_input():
    key = None
    mouse_position_x = None
    mouse_position_y = None

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
                # return the center position of square
                mouse_position_x, mouse_position_y = pygame.mouse.get_pos()
                mouse_position_x = int(mouse_position_x / SQUARE_SIZE) * SQUARE_SIZE + CENTER_X
                mouse_position_y = int(mouse_position_y / SQUARE_SIZE) * SQUARE_SIZE + CENTER_Y

            # key input from user
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_1:
                    key = 1
                    print_text(key, (mouse_position_x, mouse_position_y), GREY)

                if event.key == pygame.K_RETURN:
                    solve_sudoku()
                    print(solve_sudoku())

                if event.key == pygame.K_TAB:
                    print_text(key, (mouse_position_x, mouse_position_y), RED)

                if event.key == pygame.K_BACKSPACE:
                    erase(mouse_position_x, mouse_position_y)

        pygame.display.update()


def main():
    setup_screen()
    wait_for_user_input()


main()
pygame.quit()
