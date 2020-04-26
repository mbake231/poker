from xpath import LoginLocators
import time
import unittest
from selenium import webdriver
# from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class mike(unittest.TestCase):
    def setUp(self):
        pass

    def test_login(self):
        ##################### BOT 2
        driver2 = webdriver.Chrome(executable_path='./chromedriver.exe')
        driver2.implicitly_wait(10)
        driver2.get(LoginLocators.URL)
        time.sleep(8)
        login_menu_button = driver2.find_element_by_xpath(LoginLocators.LOGIN_MENU_BUTTON)
        login_menu_button.click()
        time.sleep(5)

        BOTNAME1 = 'mike_bot@bot'
        BOTPASS1 = 'testbot'
        CHIPS1 = '1000'

        name_field = driver2.find_element_by_xpath(LoginLocators.LOGIN_NAME_FIELD)
        password_field = driver2.find_element_by_xpath(LoginLocators.LOGIN_PASSWORD_FIELD)
        login_button = driver2.find_element_by_xpath(LoginLocators.LOGIN_BUTTON)
        name_field.send_keys(BOTNAME1)
        password_field.send_keys(BOTPASS1)
        login_button.click()

        time.sleep(40)

        for i in range(10):
            try:
                with open('tableurl.txt', 'r') as file:
                    data = file.read()
                    driver2.get(data)
                    break
            except AttributeError:
                print('waiting')
                time.sleep(15)
                with open('tableurl.txt', 'r') as file:
                    data = file.read()
                    driver2.get(data)
                    break


        time.sleep(5)

        seat = driver2.find_element_by_xpath(LoginLocators.SEAT_1)
        seat.click()

        time.sleep(3)
        add_chips = driver2.find_element_by_xpath(LoginLocators.ADD_CHIPS_INPUT)
        add_chips.send_keys(CHIPS1)
        add_chips_button = driver2.find_element_by_xpath(LoginLocators.ADD_CHIPS_BUTTON)
        add_chips_button.click()
        time.sleep(25)

        # assert user_mail.text == "au"

        # for i in range(10):
        raise_button = driver2.find_element_by_xpath(LoginLocators.RAISE_BUTTON)
        raise_button.click()

if __name__ == "__main__":
    unittest.main()