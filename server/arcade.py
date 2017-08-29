"""
Requests data from the arcade server, then sends it back to
iManchesterToolbox.
"""

from abc import ABCMeta, abstractmethod
import math
import os
import re
from subprocess import Popen, PIPE, STDOUT
import threading
import time

YEAR_REGEX = re.compile(r'([0-9]+)\).*Select.*([0-9]{2}-[0-9]{2}-[^X\n]+(X)?)+')
MODULE_REGEX = re.compile(r'[0-9]+\).*Select\s*(.*)')
IGNORED_MODULE_REGEX = re.compile(r'.*ignoring module (.*)')
PAGE_INDICATOR = {
    "main": "Setup or modify your query",
    "select": "Quit selecting",
    "results_start": "Query was",
    "results_end": "End of query results"
}

def sprint(print_string):
    """Prints the string and flushes buffer."""
    print(print_string, flush=True)

class Query(metaclass=ABCMeta):
    """An abstract class representing a general query to Arcade."""

    def __init__(self, arcade):
        self._arcade = arcade
        self._step = 0

    @abstractmethod
    def _set_query_parameters(self, line):
        """Sets the parameters of the query (e.g. modules to fetch, database, etc.)."""
        pass

    @abstractmethod
    def _set_query_type(self, line):
        """Sets the type of the query (e.g. marks-table: all)."""
        pass

    @abstractmethod
    def _collect_results(self, line):
        """Collects the results from the query's response."""
        pass

    @abstractmethod
    def _process_results(self):
        """Processes the results of the query."""
        pass

    def execute(self, process):
        """Executes the current request."""

        for raw_line in process.stdout:
            line = raw_line.decode().strip()

            # Uncomment line below to see the output of Arcade
            # sprint(line)

            if self._step < 99:
                self._set_query_parameters(line)
            elif self._step == 99:
                self._set_query_type(line)
            elif self._step == 100:
                if self._collect_results(line):
                    break

        results = self._process_results()

        # Uncomment lines below to save result of query to file.
        # result_file = open("result{}.txt".format(round(time.time())), "w")
        # result_file.write(results)
        # result_file.close()

        return results

class MarksQuery(Query):
    """Represents a 'marks-table: all' type of query to Arcade."""

    def __init__(self, arcade, start_module, limit):
        Query.__init__(self, arcade)

        self._start_module = start_module
        self._initial_limit = limit
        self._limit = limit

        # _set_query_parameters
        self._year_option = ""
        self._ignored_modules = []

        # _get_modules
        self._modules = []
        self._is_next_module_page = False

        # _collect_results
        self._capture_results = None
        self._results = []

    def _get_module_page_actions(self):
        """
        Determines the actions needed to be taken to select the modules on the module page.
        Returns the start page, the page step count required to reach the last page
        and the list of selected modules on the first and last page.
        """

        # Calculate start page and first page start
        start_page = math.floor(self._start_module / 10)
        module_count = len(self._modules)
        first_page_start = 0
        if self._start_module < module_count - 10:
            first_page_start = (self._start_module % 10)
        else:
            first_page_remaining = module_count - self._start_module
            first_page_start = 10 - first_page_remaining

        # If we need a new a new page limit the modules on current page to 9
        stop = first_page_start + self._limit - 1
        first_page_end = stop if stop < 10 else 9

        first_page_modules = range(first_page_start, first_page_end + 1)

        # Calculate end page, page count and last page module range
        end_page = math.floor((self._start_module + self._limit - 1) / 10)
        page_step_count = end_page - start_page

        last_page_modules = None
        if page_step_count != 0:
            last_page_remaining = (self._start_module + self._limit - 1) % 10
            # Last page always goes to 9 (so there are some modules,
            # which are also on this and the previous page)
            last_page_modules = range(9 - last_page_remaining + 1, 10)

        return start_page, page_step_count, first_page_modules, last_page_modules

    def _get_module_selection_string(self):
        """
        Generates the string to be sent as an input to the arcade process
        when on the modules page.
        """

        start_page, page_step_count, \
        first_page_modules, last_page_modules = self._get_module_page_actions()

        # Start string with start page selection by appending +es
        modules_string = "".join(["+" for x in range(start_page)])
        # Then append the first page module numbers
        modules_string += "".join([str(x) for x in first_page_modules])

        # Append all full pages (i.e. +0123456789)
        for _ in range(page_step_count - 1):
            modules_string += "+" + "".join([str(x) for x in range(10)])

        # If the last page is not empty append its selection string
        if last_page_modules is not None:
            modules_string += "+" + "".join([str(x) for x in last_page_modules])

        return modules_string

    def _get_modules(self, line):
        """Collects all the modules from the module pages."""

        # Collect the modules with regex
        if PAGE_INDICATOR["select"] in line:
            if self._is_next_module_page:
                self._arcade.send_input("+")
                self._is_next_module_page = False
            else:
                self._arcade.send_input("q")
                self._step = 3
        elif "Select" in line:
            modules_match = MODULE_REGEX.match(line)

            if modules_match is not None:
                module = modules_match.group(1)
                if module not in self._modules:
                    self._modules.append(module)
        elif "+)" in line:
            self._is_next_module_page = True

    def _set_query_parameters(self, line):
        """Implements the Query's parameter set method."""

        # First Select the databases to be used
        if self._step == 0:
            if PAGE_INDICATOR["main"] in line:
                self._arcade.send_input("d")
            elif "Select" in line:
                year_match = YEAR_REGEX.match(line)
                if year_match is not None and year_match.group(3) is None:
                    self._year_option = year_match.group(1)
            elif PAGE_INDICATOR["select"] in line:
                self._arcade.send_input(self._year_option + "q")
                self._step = 1

        # Then go to the modules selection page
        elif self._step == 1 and PAGE_INDICATOR["main"] in line:
            self._arcade.send_input("m")
            self._step = 2

        # Get the number of modules in the database
        elif self._step == 2:
            self._get_modules(line)

        # Go back to the first page of the module selection menu
        elif self._step == 3 and PAGE_INDICATOR["main"] in line:
            self._arcade.send_input("m")
            self._step = 4

        # Select the appropriate modules depending on start_module and limit
        elif self._step == 4:
            if PAGE_INDICATOR["select"] in line:
                module_count = len(self._modules)
                self._limit = self._limit \
                    if self._start_module + self._limit < module_count \
                    else module_count - self._start_module + 1

                self._arcade.send_input(self._get_module_selection_string())
                self._arcade.send_input("q")
                sprint(1)
                # sprint("Parameters set. Sending query...")
                self._step = 99

    def _set_query_type(self, line):
        """Implements the Query's type set method (marks-table: all)."""

        if PAGE_INDICATOR["main"] in line:
            self._arcade.send_input("c9qqr")
            sprint(2)
            # sprint("Query sent. Waiting for response...")
            self._step = 100

    def _collect_results(self, line):
        """Implements the Query's result collection method."""

        if PAGE_INDICATOR["results_start"] in line and self._capture_results is None:
            self._capture_results = True
        elif "Query output too large" in line:
            if self._capture_results:
                self._capture_results = False

            # Get the ignored modules to be refetched later
            ignored_modules_match = IGNORED_MODULE_REGEX.match(line)
            ignored_module = ignored_modules_match.group(1)
            if ignored_module not in self._ignored_modules:
                self._ignored_modules.append(ignored_module)
        elif PAGE_INDICATOR["results_end"] in line:
            if self._capture_results:
                self._capture_results = False

            self._arcade.send_input("m")
            sprint(3)
            # sprint("Response received.")
            return True

        if self._capture_results:
            self._results.append(line)

    def _process_results(self):
        """Implements the Query's result processing method."""

        # Strip unnecessary data from the end and join lines together
        results_string = "\n".join(self._results[:-2])
        results = results_string[results_string.index("Database") - 1:]

        # Refetch ignored modules
        ignored_module_count = len(self._ignored_modules)
        if ignored_module_count > 0:
            start_module = self._start_module + self._limit - ignored_module_count + 1
            limit = ignored_module_count
            sprint(4)
            # sprint("Fetching ignored modules: " + str(self._ignored_modules))
            refetch_result = self._arcade.request(0, start_module, limit)

            results += "\n\n"
            results += refetch_result[0]
            # If there were ignored modules in the refetch query append them to the list
            self._ignored_modules += refetch_result[1][1]

        return results

    def get_stats(self):
        """
        Returns the number of modules remaining after the limit of the query
        (if negative, the limit was larger than the actual number of modules in the database)
        and the list of refetched modules (due to too large output).
        """

        module_count = len(self._modules)
        remaining_module_count = module_count - (self._start_module + self._initial_limit)

        return remaining_module_count, self._ignored_modules

class Arcade(object):
    """Represents an Arcade instance and contains methods for sending requests to it."""

    def __init__(self):
        self._process = None
        self._running = False

        # Clear evnironment variable "DISPLAY" to start Arcade in CL mode
        os.environ["DISPLAY"] = ""

        sprint(0)
        # sprint("Connecting to Arcade...")
        self._process = Popen(["arcade"], stdin=PIPE, stdout=PIPE, stderr=STDOUT, bufsize=1)
        self._running = True

    def send_input(self, keys):
        """Sends a binary string to the Arcade process' input stream and flushes it."""

        self._process.stdin.write(keys.encode())
        self._process.stdin.flush()

    def _reset_parameters(self):
        """Resets the parameters of the current query."""
        self.send_input("-")

    def request(self, query_type, start_module, limit):
        """Prepares and executes the type of request specified."""

        if not self._running:
            sprint("Error: Query couldn't be sent, because the Arcade process isn't running.")
            return ""

        self._reset_parameters()

        query = None
        if query_type == 0:
            query = MarksQuery(self, start_module, limit)

        return query.execute(self._process), query.get_stats()

    def close(self):
        """Exits the arcade instance and closes the process."""

        sprint(5)
        # sprint("Exiting arcade...")
        self.send_input("qx")
        self._running = False

class User(object):
    """
    Represents a user and contains methods for fetching specific data
    from Arcade in pieces and putting them together.
    """

    def __init__(self):
        self._marks = ""
        self._mark_lock = threading.Lock()

    def _make_request(self, query_type, limit, number):
        """
        Fetches a piece of specific type of information from Arcade
        and appends it to the marks string.
        """

        arcade_instance = Arcade()
        marks = arcade_instance.request(query_type, limit * number, limit)[0]

        with self._mark_lock:
            self._marks += marks

        arcade_instance.close()

    def get_marks(self, limit, request_count):
        """
        Spawns "request_count" number of threads with "limit" number of modules
        to get the mark tables in several pieces, then it writes the result to file.
        """

        # self._make_request(0, 10, 1)

        self._marks = ""
        threads = []
        for i in range(request_count):
            thread = threading.Thread(target=self._make_request, args=(0, limit, i))
            thread.start()
            threads.append(thread)

        for thread in threads:
            thread.join()

        result_file = open("./.imant/finalresult0.txt", "w")
        result_file.write(self._marks)
        result_file.close()

if __name__ == "__main__":
    USER = User()
    USER.get_marks(10, 3)
