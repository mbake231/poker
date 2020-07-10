#!/usr/bin/python3
import selenium
from selenium.webdriver.chrome.options import Options
from xpath import LoginLocators
import time
import unittest
from selenium import webdriver
# from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class todd(unittest.TestCase):
    def setUp(self):
        pass

    def test_login(self):
        ##################### BOT 2
        user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'
        options = Options()
        options.add_argument(LoginLocators.HEADLESS)
        options.add_argument(LoginLocators.MAXIMIZED)
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        # options.add_argument(f'user-agent={user_agent}')
        driver5 = webdriver.Chrome(options=options, executable_path=r'./chromedriver')
<<<<<<< HEAD
        driver5.implicitly_wait(30)
=======
        driver5.implicitly_wait(15)
>>>>>>> 91b09633d5a63f4305aca5ded9f1468eccbd9c88
        driver5.get(LoginLocators.URL)
        time.sleep(8)
        login_menu_button = driver5.find_element_by_xpath(LoginLocators.LOGIN_MENU_BUTTON)
        login_menu_button.click()
        time.sleep(5)

        BOTNAME1 = 'todd_bot@bot'
        BOTPASS1 = 'testbot'
        CHIPS1 = '10'

        name_field = driver5.find_element_by_xpath(LoginLocators.LOGIN_NAME_FIELD)
        password_field = driver5.find_element_by_xpath(LoginLocators.LOGIN_PASSWORD_FIELD)
        login_button = driver5.find_element_by_xpath(LoginLocators.LOGIN_BUTTON)
        name_field.send_keys(BOTNAME1)
        password_field.send_keys(BOTPASS1)
        login_button.click()
        print("TODD: Login successful")
        time.sleep(40)

        for i in range(10):
            try:
                with open('tableurl.txt', 'r') as file:
                    data = file.read()
                    driver5.get(data)
                    break
            except AttributeError:
                print('waiting')
                time.sleep(15)
                with open('tableurl.txt', 'r') as file:
                    data = file.read()
                    driver5.get(data)
                    break


        time.sleep(9)
        time.sleep(3)
        close_button = driver5.find_element_by_xpath(LoginLocators.CLOSE_ALLERT)
        close_button.click()
        time.sleep(3)
        seat = driver5.find_element_by_xpath(LoginLocators.SEAT_5)
        seat.click()
<<<<<<< HEAD
=======
        print("Todd: Sit on seat5 successful")
>>>>>>> 91b09633d5a63f4305aca5ded9f1468eccbd9c88

        time.sleep(12)
        add_chips = driver5.find_element_by_xpath(LoginLocators.ADD_CHIPS_INPUT)
        add_chips.send_keys(CHIPS1)
        add_chips_button = driver5.find_element_by_xpath(LoginLocators.ADD_CHIPS_BUTTON)
        add_chips_button.click()
        print("Todd: Chips added successful")
        time.sleep(40)


        for i in range(10000):
            try:
                time.sleep(1)
                check_button = driver5.find_element_by_xpath(LoginLocators.CHECK_BUTTON)
                check_button.click()
                print("Todd: Check button clicked")
            except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                try:
                    time.sleep(1)
                    call_button = driver5.find_element_by_xpath(LoginLocators.CALL_BUTTON)
                    call_button.click()
                    print("Todd: Call button clicked")
                except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                    try:
                        time.sleep(1)
                        raise_button = driver5.find_element_by_xpath(LoginLocators.RAISE_BUTTON)
                        raise_button.click()
                        print("Todd: Raise button clicked")
                    except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                        try:
                            results = driver5.find_element_by_xpath(LoginLocators.RESULT)
                            results = results.text
                            assert '$0.00' == results
                        except (AssertionError, selenium.common.exceptions.NoSuchElementException):
                            time.sleep(5)
                        print("Todd: None button available")

if __name__ == "__main__":
    unittest.main()