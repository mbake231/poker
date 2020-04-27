#!/usr/bin/python3
import selenium
from selenium.webdriver.chrome.options import Options
from xpath import LoginLocators
import time
import unittest
from selenium import webdriver
# from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class shane(unittest.TestCase):
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
        driver3 = webdriver.Chrome(options=options, executable_path=r'./chromedriver')

        driver3.implicitly_wait(30)
        driver3.get(LoginLocators.URL)
        time.sleep(8)
        login_menu_button = driver3.find_element_by_xpath(LoginLocators.LOGIN_MENU_BUTTON)
        login_menu_button.click()
        time.sleep(8)

        BOTNAME1 = 'shane_bot@bot'
        BOTPASS1 = 'testbot'
        CHIPS1 = '500'

        name_field = driver3.find_element_by_xpath(LoginLocators.LOGIN_NAME_FIELD)
        password_field = driver3.find_element_by_xpath(LoginLocators.LOGIN_PASSWORD_FIELD)
        login_button = driver3.find_element_by_xpath(LoginLocators.LOGIN_BUTTON)
        name_field.send_keys(BOTNAME1)
        password_field.send_keys(BOTPASS1)
        login_button.click()
        print("Shane Login successful")
        time.sleep(40)

        for i in range(10):
            try:
                with open('tableurl.txt', 'r') as file:
                    data = file.read()
                    driver3.get(data)
                    break
            except AttributeError:
                print('waiting')
                time.sleep(15)
                with open('tableurl.txt', 'r') as file:
                    data = file.read()
                    driver3.get(data)
                    break

        time.sleep(3)
        close_button = driver3.find_element_by_xpath(LoginLocators.CLOSE_ALLERT)
        close_button.click()
        time.sleep(3)

        time.sleep(13)

        seat = driver3.find_element_by_xpath(LoginLocators.SEAT_2)
        seat.click()

        time.sleep(11)
        add_chips = driver3.find_element_by_xpath(LoginLocators.ADD_CHIPS_INPUT)
        add_chips.send_keys(CHIPS1)
        add_chips_button = driver3.find_element_by_xpath(LoginLocators.ADD_CHIPS_BUTTON)
        add_chips_button.click()
        print("Shane: Chips added successful")
        time.sleep(20)

        for i in range(10000):
            try:
                time.sleep(1)
                check_button = driver3.find_element_by_xpath(LoginLocators.CHECK_BUTTON)
                check_button.click()
                print("Shane: Check button clicked")
            except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                try:
                    time.sleep(1)
                    call_button = driver3.find_element_by_xpath(LoginLocators.CALL_BUTTON)
                    call_button.click()
                    print("Shane: Call button clicked")
                except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                    try:
                        time.sleep(1)
                        raise_button = driver3.find_element_by_xpath(LoginLocators.RAISE_BUTTON)
                        raise_button.click()
                        print("Shane: Raise button clicked")
                    except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
                        time.sleep(5)
                        print("Shane: None button available")

if __name__ == "__main__":
    unittest.main()