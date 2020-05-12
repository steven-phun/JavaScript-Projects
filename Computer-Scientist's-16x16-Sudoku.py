import math
import pygame

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

        self.surface = pygame.display.set_mode([self.gui, self.gui + Sudoku.LEGEND_HEIGHT])
        self.x_center = self.grid
        self.y_center = 2

    def solve(self):
        """
        solve the sudoku using backtracking recursion

        :return:    'true' if the program finds a solution to the sudoku
        """

        for row in range(0, self.grid):
            for column in range(0, self.grid):
                if self.board[row][column] == Sudoku.EMPTY_SQUARE:
                    for element in range(0, self.grid):
                        if self.validate(row, column, element):
                            self.board[row][column] = element
                            self.display_text(element, column * self.square + self.x_center,
                                              row * self.square + self.y_center, Sudoku.LARGE, Sudoku.BLACK)
                            # base case: if element leads to a solution
                            if self.solve():
                                return True
                            else:
                                # backtrack: if element does not lead to a solution
                                self.board[row][column] = Sudoku.EMPTY_SQUARE
                                self.clear_square(column * self.square + self.x_center,
                                                  row * self.square + self.y_center)
                    return False
        return True

    def validate(self, row, column, element):
        """
        determines if the element can be placed in the square

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
        draws the vertical and horizontal lines for the grid
        """

        for i in range(self.grid + 1):
            if i % self.num_of_boxes == 0 and i != 0:
                thickness = 2
            else:
                thickness = 1

            # vertical line
            pygame.draw.line(self.surface, Sudoku.BLACK, (i * self.square, 0), (i * self.square, self.gui), thickness)
            # horizontal line
            pygame.draw.line(self.surface, Sudoku.BLACK, (0, i * self.square), (self.gui, i * self.square), thickness)

    def draw_setter(self):
        """
        displays the fixed numbers and letters (setter) on the grid
        """
        for row in range(0, self.grid):
            for column in range(0, self.grid):
                if self.board[row][column] != Sudoku.EMPTY_SQUARE:
                    self.display_text(self.board[row][column],
                                      column * self.square + self.x_center,
                                      row * self.square + self.y_center, Sudoku.LARGE, Sudoku.BLUE)

    # @param text            is object to be printed on the screen
    # @param position x,y    is the coordinates the user wants the 'text' to be displayed
    #
    # @post                  display the 'text' on coordinates 'position' on the screen
    def display_text(self, text, x_position, y_position, size, color):
        """
        :param text:            the 'text' to be displayed on the GUI
        :param x_position:      the x coordinate where 'text' will be displayed
        :param y_position:      the y coordinate where 'text' will be displayed
        :param size:            font size
        :param color:           font color
        """

        if color is None:
            color = Sudoku.BLACK

        self.clear_square(x_position, y_position)

        if isinstance(text, int):
            # convert int 10+ to A, B, C, D, E, F
            if text > 9:
                text += 65 - 10  # ASCII code for A is 65
                text = chr(text)

        font = pygame.font.SysFont('Comic Sans MS', size)
        text_surface = font.render(str(text), True, color)
        self.surface.blit(text_surface, (x_position, y_position))
        pygame.display.update()

    def clear_square(self, x_position, y_position):
        """
        erase the element at given coordinate

        :param x_position:   represents given x coordinate
        :param y_position:   represents given y coordinate
        """

        rectangle = x_position, y_position, self.square - self.x_center, self.square - self.y_center
        pygame.draw.rect(self.surface, Sudoku.WHITE, rectangle, 0)

    def center_element(self, x_position, y_position):
        """
        :param x_position:   represents given x coordinate
        :param y_position:   represents given y coordinate
        :return:             the center (x, y) coordinates of a square
        """

        return x_position + self.grid, y_position + 2

    def display_legend(self):
        """ display instructions in the legend area """

        self.clear_legend()
        self.display_text(" -Space: to place an answer", 0, self.gui + 40 * 0 + 2, Sudoku.SMALL, Sudoku.BLACK)
        self.display_text(" -Backspace: to erase", 0, self.gui + 40 * 1, Sudoku.SMALL, Sudoku.BLACK)
        self.display_text(" -Enter: to have the program solve the Sudoku", 0, self.gui + 40 * 3, Sudoku.SMALL, Sudoku.BLACK)
        self.display_text("Stopwatch:", 625, self.gui + 40 * 3, Sudoku.SMALL, Sudoku.BLACK)

    def update_legend(self):
        """ update legend area when searching and prompting the user when solution is found"""

        self.clear_legend()
        self.display_text(" Searching for Solution ...", 0, self.gui + 40, Sudoku.SMALL, Sudoku.BLACK)

        self.solve()

        self.clear_legend()
        self.display_text("Time:", 675, self.grid + 40 * 3, Sudoku.SMALL, Sudoku.BLACK)
        self.display_text(" Solution Found:  " + str(self.solve), 0, self.grid + 40, Sudoku.SMALL, Sudoku.BLACK)

    def clear_legend(self):
        """ erase all text in the legend area """

        pygame.draw.rect(self.surface, Sudoku.WHITE, (0, self.gui + 2, self.gui, self.gui + Sudoku.LEGEND_HEIGHT), 0)

    def allow_user_inputs(self):
        """
        records user's keyboard and mouse input
        then, displays the outputs to the GUI accordingly
        """

        # object represents a stopwatch
        stopwatch = pygame.time.Clock()
        timer = 0

        # object stores the user's input key
        key = None

        # mouse coordinates relative to grid index
        x_position = None
        y_position = None

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
                        x_position, y_position = pygame.mouse.get_pos()

                        x_position = int(x_position / self.square)
                        y_position = int(y_position / self.square)

                        print_x = int(x_position * self.square) + self.x_center
                        print_y = int(y_position * self.square) + self.y_center

                    # key input from user
                    if event.type == pygame.KEYDOWN:

                        # enter to solve the sudoku
                        if event.key == pygame.K_RETURN:
                            self.update_legend()

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
                        if key is not None and x_position <= self.gui and y_position <= self.gui:
                            # edge case: if user tries to edit a setter element
                            if self.board[y_position][x_position] is None:

                                self.display_text(key, print_x, print_y, Sudoku.LARGE, Sudoku.GREY)

                                if self.validate(y_position, x_position, key):

                                    if event.key == pygame.K_SPACE:
                                        self.board[y_position][x_position] = key
                                        self.display_text(key, print_x, print_y, Sudoku.LARGE, Sudoku.RED)

                            if event.key == pygame.K_BACKSPACE:
                                self.board[y_position][x_position] = None
                                self.clear_square(print_x, print_y)

                # display stop watch
                # start stopwatch
                seconds = stopwatch.tick() / 1000.0  # represents the milliseconds that has gone by
                timer += seconds
                display_timer = math.trunc(timer)
                self.display_text(str(display_timer), 750, 920, Sudoku.SMALL, Sudoku.BLACK)

                pygame.display.update()


class square:
    pass


def main():
    sudoku = Sudoku(16, 800)

    sudoku.display_surface()
    sudoku.allow_user_inputs()


if __name__ == "__main__":
    main()

pygame.quit()
