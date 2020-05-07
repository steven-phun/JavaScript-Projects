import math

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

# represents an empty square in the grid
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

# rbh color
WHITE = [255, 255, 255]
BLACK = [0, 0, 0]
BLUE = [0, 0, 255]
RED = [255, 0, 0]
GREY = [192, 192, 192]

# font size
LARGE = 30
SMALL = 20

# initialize interface object for user
display_surface = pygame.display.set_mode([WIDTH, HEIGHT + LEGEND_HEIGHT])


# user's grid to play or solve with
sudoku_grid = [[None, 5, None, None, None, None, None, 7, 10, None, None, 14, 13, None, None, 15],
               [14, 10, None, None, None, 15, 13, None, None, None, 11, None, None, 5, None, None],
               [12, None, 8, 11, None, None, None, None, 2, 15, 13, None, 14, 10, 9, None],
               [1, None, 15, None, 10, None, 14, 9, 0, None, None, None, None, None, None, None],
               [None, 14, 10, 9, None, None, 15, 1, 12, 7, 8, 11, None, None, None, None],
               [11, 12, None, None, 3, 0, 4, 5, 1, 2, None, None, None, None, 10, 9],
               [4, None, 5, 0, 11, None, 8, None, 14, 10, 9, 6, 15, None, None, 2],
               [None, 1, None, None, None, 9, None, 10, 5, None, 4, None, None, 12, None, 8],
               [9, 6, 14, 10, 15, None, None, None, 11, 12, None, None, None, None, None, 5],
               [8, None, None, None, None, None, 0, None, None, 1, None, 15, 9, None, None, 10],
               [0, None, 3, 5, 8, 12, None, None, 6, None, 10, None, 2, 15, None, None],
               [15, 13, None, None, 6, None, 9, 14, 3, 5, 0, None, None, None, 12, 7],
               [10, 9, None, 14, None, None, None, 15, 8, 11, 12, None, None, 0, 4, 3],
               [None, None, 11, None, 0, 3, 5, None, 15, None, None, None, 10, 9, None, None],
               [None, None, 4, None, 7, 11, 12, None, 9, None, None, 10, 1, None, None, 13],
               [2, 15, None, None, 9, None, None, 6, None, None, 5, None, None, None, 11, None]]


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
                        print_text(element, column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y, LARGE, BLACK)

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
    for row in range(0, GRID_SIZE):
        for column in range(0, GRID_SIZE):
            if sudoku_grid[row][column] != EMPTY_SQUARE:
                print_text(sudoku_grid[row][column],
                           column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y, LARGE, BLUE)


# @param text            is object to be printed on the screen
# @param position x,y    is the coordinates the user wants the 'text' to be displayed
#
# @post                  display the 'text' on coordinates 'position' on the screen
def print_text(text, position_x, position_y, size, color):

    erase(position_x, position_y)

    if isinstance(text, int):
        # convert 10 to A, 11 to B, 12 to C
        if text > 9:
            text += 65 - 10  # ASCII code for A is 65
            text = chr(text)

    font = pygame.font.SysFont('Comic Sans MS', size)
    text_surface = font.render(str(text), True, color)
    display_surface.blit(text_surface, (position_x, position_y))
    pygame.display.update()


# @post erase element in square by drawing a white rectangle over it
def erase(x, y):
    pygame.draw.rect(display_surface, WHITE, (x, y, SQUARE_SIZE - CENTER_X, SQUARE_SIZE - CENTER_Y), 0)


def display_legend():
    clear_legend()
    print_text(" -Key- to pencil desire the element", 0, WIDTH + 5, SMALL, BLACK)
    print_text(" -Tab- to place a guess", 0, WIDTH + 40, SMALL, BLACK)
    print_text(" -Backspace- to erase", 0, WIDTH + 40 * 2, SMALL, BLACK)
    print_text(" -Enter- to solve", 0, WIDTH + 40 * 3, SMALL, BLACK)
    print_text("Stopwatch:", 625, WIDTH + 40 * 3, SMALL, BLACK)


def update_legend():
    clear_legend()
    print_text("Time:", 675, WIDTH + 40 * 3, SMALL, BLACK)
    print_text(" Solution Found:  " + str(solve_sudoku()), 0, WIDTH + 40, SMALL, BLACK)


def clear_legend():
    pygame.draw.rect(display_surface, WHITE, (0, HEIGHT + 2, WIDTH, HEIGHT + LEGEND_HEIGHT), 0)


# this method records the user's key and mouse input
# and displays the input using GUI for the user
def wait_for_user_input():
    # object represents a stopwatch
    stopwatch = pygame.time.Clock()
    timer = 0

    # object stores the user's input key
    key = None

    # mouse coordinates relative to grid index
    position_x = None
    position_y = None

    # mouse coordinates relative to center of square
    print_x = None
    print_y = None

    run_loop = True  # allow user to to see the solution and timestamp
    input_loop = True
    while run_loop:
        while input_loop:

            # get user inputs
            for event in pygame.event.get():

                # exit the program
                if event.type == pygame.QUIT:
                    input_loop = False

                # click input from user
                if event.type == pygame.MOUSEBUTTONDOWN:
                    position_x, position_y = pygame.mouse.get_pos()

                    position_x = int(position_x / SQUARE_SIZE)
                    position_y = int(position_y / SQUARE_SIZE)

                    print_x = int(position_x * SQUARE_SIZE) + CENTER_X
                    print_y = int(position_y * SQUARE_SIZE) + CENTER_Y

                # key input from user
                if event.type == pygame.KEYDOWN:

                    # enter to solve the sudoku
                    if event.key == pygame.K_RETURN:
                        clear_legend()
                        print_text(" Searching for Solution ...", 0, WIDTH + 40, SMALL, BLACK)
                        solve_sudoku()
                        update_legend()

                        input_loop = False
                    if event.key == pygame.K_0:
                        key = 0
                    if event.key == pygame.K_1:
                        key = 1
                    if event.key == pygame.K_2:
                        key = 2
                    if event.key == pygame.K_3:
                        key = 3
                    if event.key == pygame.K_4:
                        key = 4
                    if event.key == pygame.K_5:
                        key = 5
                    if event.key == pygame.K_6:
                        key = 6
                    if event.key == pygame.K_7:
                        key = 7
                    if event.key == pygame.K_8:
                        key = 8
                    if event.key == pygame.K_9:
                        key = 9
                    if event.key == pygame.K_a:
                        key = 10
                    if event.key == pygame.K_b:
                        key = 11
                    if event.key == pygame.K_c:
                        key = 12
                    if event.key == pygame.K_d:
                        key = 13
                    if event.key == pygame.K_e:
                        key = 14
                    if event.key == pygame.K_f:
                        key = 15

                    # edge case: if user tries to make changes outside of grid
                    if key is not None and position_x <= WIDTH and position_y <= HEIGHT:
                        # edge case: if user tries to edit a setter element
                        if sudoku_grid[position_y][position_x] is None:

                            # print element to square
                            erase(print_x, print_y)
                            print_text(key, print_x, print_y, LARGE, GREY)

                            # checks if element is safe to be placed in square
                            if safe_to_pencil_element(position_y, position_x, key):

                                # tab to place a guess an element
                                if event.key == pygame.K_TAB:
                                    sudoku_grid[position_y][position_x] = key
                                    print_text(key, print_x, print_y, LARGE, RED)

                        # backspace to remove an element from the square
                        if event.key == pygame.K_BACKSPACE:
                            sudoku_grid[position_y][position_x] = None
                            erase(print_x, print_y)

            # display stop watch
            # start stopwatch
            seconds = stopwatch.tick() / 1000.0  # represents the milliseconds that has gone by
            timer += seconds
            display_timer = math.trunc(timer)
            print_text(str(display_timer), 750, 920, SMALL, BLACK)

            pygame.display.update()


def main():
    setup_screen()
    wait_for_user_input()


main()
pygame.quit()
