from xpath import LoginLocators
import time
import unittest
from selenium import webdriver
# from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class jim(unittest.TestCase):
    def setUp(self):
        pass

    def test_login(self):
        driver = webdriver.Chrome(executable_path='./chromedriver.exe')
        driver.implicitly_wait(10)
        driver.get(LoginLocators.URL)
        time.sleep(3)

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
        time.sleep(3)

        # logout_text = self.find_element(By.XPATH, "//button[contains (text(), 'Logout')]")
        logout_text = "Logout"

        start_table = driver.find_element_by_xpath(LoginLocators.START_TABLE)
        start_table.click()

        blind = driver.find_element_by_xpath(LoginLocators.BLIND)
        blind.send_keys(Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN + Keys.DOWN)
        time.sleep(2)
        # self.browser.find_element(By.XPATH, "//option[last()")
        # option.send_keys(Keys.RETURN)

        small_blind = driver.find_element_by_xpath(LoginLocators.SMALL_BLIND)
        small_blind.send_keys('2')
        big_blind = driver.find_element_by_xpath(LoginLocators.BIG_BLIND)
        big_blind.send_keys('1')

        crt_table = driver.find_element_by_xpath(LoginLocators.CREATE_TABLE)
        crt_table.click()
        time.sleep(8)

    # def sit(self):
        seat = driver.find_element_by_xpath(LoginLocators.SEAT_0)
        seat.click()

    # def add_chips(self, chips):
        time.sleep(3)
        add_chips = driver.find_element_by_xpath(LoginLocators.ADD_CHIPS_INPUT)
        add_chips.send_keys(CHIPS)
        add_chips_button = driver.find_element_by_xpath(LoginLocators.ADD_CHIPS_BUTTON)
        add_chips_button.click()
        time.sleep(10)

        text_file = open("tableurl.txt", "w")
        n = text_file.write(driver.current_url)
        text_file.close()

        time.sleep(60)

        call_button = driver.find_element_by_xpath(LoginLocators.CALL_BUTTON)
        call_button.click()



if __name__ == "__main__":
    unittest.main()