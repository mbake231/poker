#!/usr/bin/python3
import selenium
from xpath import LoginLocators
import time
import unittest
from selenium import webdriver

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

class jim(unittest.TestCase):
    def setUp(self):
        pass

    def test_login(self):
        user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'
        options = Options()
        options.add_argument(LoginLocators.HEADLESS)
        options.add_argument(LoginLocators.MAXIMIZED)
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        # options.add_argument(f'user-agent={user_agent}')
        driver = webdriver.Chrome(options=options, executable_path=r'./chromedriver')
        driver.implicitly_wait(30)
        driver.get(LoginLocators.URL)
        time.sleep(6)

        login_menu_button = driver.find_element_by_xpath(LoginLocators.LOGIN_MENU_BUTTON)
        login_menu_button.click()
        time.sleep(5)

        BOTNAME = 'jim_bot@bot'
        BOTPASS = 'testbot'
        CHIPS = '1000'

        name_field = driver.find_element_by_xpath(LoginLocators.LOGIN_NAME_FIELD)
        password_field = driver.find_element_by_xpath(LoginLocators.LOGIN_PASSWORD_FIELD)
        login_button = driver.find_element_by_xpath(LoginLocators.LOGIN_BUTTON)
        name_field.send_keys(BOTNAME)
        password_field.send_keys(BOTPASS)
        login_button.click()

        print("Jim: Login successful")
        time.sleep(8)
        start_table = driver.find_element_by_xpath(LoginLocators.START_TABLE)
        start_table.click()

        blind = driver.find_element_by_xpath(LoginLocators.BLIND)
        blind.send_keys(Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN)
        time.sleep(2)

        small_blind = driver.find_element_by_xpath(LoginLocators.SMALL_BLIND)
        small_blind.send_keys('2')
        big_blind = driver.find_element_by_xpath(LoginLocators.BIG_BLIND)
        big_blind.send_keys('1')

        crt_table = driver.find_element_by_xpath(LoginLocators.CREATE_TABLE)
        crt_table.click()
        time.sleep(8)
        print("Jim: Table created successful")

        time.sleep(3)
        close_button = driver.find_element_by_xpath(LoginLocators.CLOSE_ALLERT)
        close_button.click()
        time.sleep(3)

    # def sit(self):
        seat = driver.find_element_by_xpath(LoginLocators.SEAT_0)
        seat.click()

    # def add_chips(self, chips):
        time.sleep(16)
        add_chips = driver.find_element_by_xpath(LoginLocators.ADD_CHIPS_INPUT)
        add_chips.send_keys(CHIPS)
        add_chips_button = driver.find_element_by_xpath(LoginLocators.ADD_CHIPS_BUTTON)
        add_chips_button.click()
        time.sleep(10)
        print("Jim: Chips added successful")


        text_file = open("tableurl.txt", "w")
        n = text_file.write(driver.current_url)
        print(f'Jim: Table URL {n}')
        text_file.close()

        time.sleep(60)
        for i in range(10000):
            try:
                time.sleep(1)
                check_button = driver.find_element_by_xpath(LoginLocators.CHECK_BUTTON)
                check_button.click()
                print("Jim: Check button clicked")
            except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                try:
                    time.sleep(1)
                    call_button = driver.find_element_by_xpath(LoginLocators.CALL_BUTTON)
                    call_button.click()
                    print("Jim: Call button clicked")
                except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                    try:
                        time.sleep(1)
                        raise_button = driver.find_element_by_xpath(LoginLocators.RAISE_BUTTON)
                        raise_button.click()
                        print("Jim: Raise button clicked")
                    except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                        time.sleep(5)
                        print("Jim: None button available")

if __name__ == "__main__":
    unittest.main()