import math
import pygame
import time

"""
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
# -note                     place a temporary number or letter in the square.
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
"""


class Sudoku:

    # represents an empty square in the grid
    EMPTY_SQUARE = None

    # represents the length of the legend in GUI
    LEGEND_HEIGHT = 150

    # rgb color code
    WHITE = [255, 255, 255]
    BLACK = [0, 0, 0]
    BLUE = [0, 0, 255]
    RED = [255, 0, 0]
    GREY = [192, 192, 192]

    # font size
    LARGE = 30
    SMALL = 20

    # the original state of the user's grid
    board = [[None, 5, None, None, None, None, None, 7, 10, None, None, 14, 13, None, None, 15],
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

    def __init__(self, grid_size, gui_size):
        """
        instantiate a sudoku grid

        :param grid_size:    represents the number of rows and columns in the grid
        :param gui_size:     represents the height and weight of the GUI that displays the grid
        """

        self.grid = grid_size
        self.gui = gui_size
        self.square = gui_size / grid_size
        self.num_of_boxes = int(math.sqrt(grid_size))  # represents the number of boxes in each row or column
        self.surface = pygame.display.set_mode([gui_size + Sudoku.LEGEND_HEIGHT])  # initialize GUI object for user

    def solve(self):
        """
        this method will solve the sudoku using backtracking recursion

        :return:    'true' if the program finds a solution to the sudoku
        """

        for row in range(0, self.grid):
            for column in range(0, self.grid):
                if self.board[row][column] == Sudoku.EMPTY_SQUARE:
                    for element in range(0, self.grid):
                        if self.validate(row, column, element):
                            self.board[row][column] = element
                            self.display_element(element, column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y,
                                                 LARGE,
                                                 BLACK)
                            # base case: if element leads to a solution
                            if self.solve():
                                return True
                            else:
                                # backtrack: if element does not lead to a solution
                                self.board[row][column] = Sudoku.EMPTY_SQUARE
                                self.clear_element(column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y)
                    return False
        return True

    def validate(self, row, column, element):
        """
        this method determines if the element can be placed in the square

        :param row:         the row that the 'element' is in
        :param column:      the column that the 'element' is in
        :param element:     the 'element' that is being penciled in
        :return:            'true' if the element does not exists in 'row', 'column' and 'box
        """
        return not (self.check_row(row, element) or
                    self.check_column(column, element) or
                    self.check_box(row, column, element))

    def check_row(self, row, element):
        """
        :param row:         the row that the 'element' is located
        :param element:     the element that is being checked
        :return:            true, if 'row' contains 'element'
        """
        for column in range(0, self.grid):
            if self.board[row][column] == element:
                return True

        return False

    def check_column(self, column, element):
        """
        :param column:      the column that the 'element' is located
        :param element:     the element that is being checked
        :return:            true, if the 'column' contains the 'element'
        """
        for row in range(0, self.grid):
            if self.board[row][column] == element:
                return True

        return False

    def check_box(self, row, column, element):
        """
        :param row:         the row that the 'element' is located
        :param column:      the column that the 'element' is located
        :param element:     the element that is being checked
        :return:            true, if the 'box' contains the 'element'
        """

        # find every square indices for a box with given 'row' and 'column'
        row_box_index = row - row % self.num_of_boxes
        column_box_index = column - column % self.num_of_boxes

        for box in range(row_box_index, row_box_index + self.num_of_boxes):
            for square in range(column_box_index, column_box_index + self.num_of_boxes):
                if self.board[box][square] == element:
                    return True

        return False

    def display_surface(self):
        """
        instantiate the GUI surface for the user to interact with
        """

        pygame.font.init()
        pygame.display.set_caption("Computer Scientist's 16x16 Sudoku")

        self.surface.fill(Sudoku.WHITE)
        self.draw_grid_lines()
        self.draw_setter()
        self.display_legend()

    def draw_grid_lines(self):
        """
        this method draws the vertical and horizontal lines for the grid
        """

        for i in range(self.grid + 1):
            if i % self.num_of_boxes == 0 and i != 0:
                thickness = 2
            else:
                thickness = 1

            # vertical line
            pygame.draw.line(self.surface, Sudoku.BLACK, (i * self.square, 0), (i * self.square, self.board), thickness)
            # horizontal line
            pygame.draw.line(self.surface, Sudoku.BLACK, (0, i * self.square), (self.board, i * self.square), thickness)

    def draw_setter(self):
        """
        this method displays the fixed numbers and letters (setter) on the grid
        """
        for row in range(0, self.grid):
            for column in range(0, self.grid):
                if self.board[row][column] != Sudoku.EMPTY_SQUARE:
                    print_text(self.board[row][column],
                               column * SQUARE_SIZE + CENTER_X, row * SQUARE_SIZE + CENTER_Y, LARGE, BLUE)

    # @param text            is object to be printed on the screen
    # @param position x,y    is the coordinates the user wants the 'text' to be displayed
    #
    # @post                  display the 'text' on coordinates 'position' on the screen
    def display_element(self, text, x_position, y_position, size, color):

        self.clear_element(x_position, y_position)

        if isinstance(text, int):
            # convert int 10+ to A, B, C, D, E, F
            if text > 9:
                text += 65 - 10  # ASCII code for A is 65
                text = chr(text)

        font = pygame.font.SysFont('Comic Sans MS', size)
        text_surface = font.render(str(text), True, color)
        self.surface.blit(text_surface, (x_position, y_position))
        pygame.display.update()

    def clear_element(self, x, y):
        """
        :param x:   represents given x coordinate
        :param y:   represents given y coordinate
        :return:    a white rectangle that erases the element in a square
        """
        pygame.draw.rect(self.surface, Sudoku.WHITE, (x, y, SQUARE_SIZE - CENTER_X, SQUARE_SIZE - CENTER_Y), 0)

    def center_element(self, x, y):
        """
        :param x:   represents given x coordinate
        :param y:   represents given y coordinate
        :return:    the (x,y) coordinates of the center of a square
        """

        return x + self.board, y + 2

    def display_legend():
        clear_legend()
        print_text(" -Space-  to place a guess", 0, WIDTH + 40 * 0 + 2, SMALL, BLACK)
        print_text(" -Backspace-  to erase", 0, WIDTH + 40 * 1, SMALL, BLACK)
        print_text(" -Enter-  to have the program find a solution", 0, WIDTH + 40 * 3, SMALL, BLACK)
        print_text("Stopwatch:", 625, WIDTH + 40 * 3, SMALL, BLACK)

    def update_legend(self):
        clear_legend()
        print_text("Time:", 675, WIDTH + 40 * 3, SMALL, BLACK)
        print_text(" Solution Found:  " + str(solve_sudoku()), 0, WIDTH + 40, SMALL, BLACK)

    def clear_legend(self):
        pygame.draw.rect(display_surface, WHITE, (0, HEIGHT + 2, WIDTH, HEIGHT + LEGEND_HEIGHT), 0)

    # this method records the user's key and mouse input
    # and displays the input using GUI for the user
    def allow_user_inputs(self):
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
                            self.clear_legend()
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
                            if board[position_y][position_x] is None:

                                # print element to square
                                print_text(key, print_x, print_y, LARGE, GREY)

                                # checks if element is safe to be placed in square
                                if safe_to_pencil_element(position_y, position_x, key):

                                    # tab to place a guess an element
                                    if event.key == pygame.K_TAB:
                                        board[position_y][position_x] = key
                                        print_text(key, print_x, print_y, LARGE, RED)

                            # backspace to remove an element from the square
                            if event.key == pygame.K_BACKSPACE:
                                board[position_y][position_x] = None
                                erase(print_x, print_y)

                # display stop watch
                # start stopwatch
                seconds = stopwatch.tick() / 1000.0  # represents the milliseconds that has gone by
                timer += seconds
                display_timer = math.trunc(timer)
                print_text(str(display_timer), 750, 920, SMALL, BLACK)

                pygame.display.update()


class square:
    pass


def main():
    sudoku = Sudoku(9, 800)

    sudoku.display_surface()
    sudoku.wait_for_user_input()


if __name__ == "__main__":
    main()

pygame.quit()
