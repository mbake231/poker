class LoginLocators:
    URL = 'https://www.thelocalgame.com/'
    LOGIN_MENU_BUTTON = "//button[@class='btn btn-primary' and contains (text(), 'Login')]"
    LOGOUT_BUTTON = "//button[@type='button' and contains (text(), 'Logout')]"
    START_TABLE = "//button[@type='button' and contains (text(), 'Start a Texas Hold')]"
    table_url = ''
    LOGIN_PASSWORD_FIELD = f"//input[@id='loginpassword']"
    LOGIN_NAME_FIELD = "//input[@id='email']"
    LOGIN_BUTTON = f"//div[@class='Login']/form/button[@type='submit' and contains (text(), 'Login')]"
    BLIND = "//label[contains (text(), 'Blinds')]/following-sibling::select"
    SMALL_BLIND = "//input[@id='smallblind']"
    BIG_BLIND = "//input[@id='bigblind']"
    CREATE_TABLE = "//button[contains (text(), 'Create My Table')]"
    SEAT_0 = "//div[@id='seat0']/div/div/button[@class='sitButton btn btn-primary']"
    SEAT_1 = "//div[@id='seat1']/div/div/button[@class='sitButton btn btn-primary']"
    SEAT_2 = "//div[@id='seat2']/div/div/button[@class='sitButton btn btn-primary']"
    SEAT_3 = "//div[@id='seat3']/div/div/button[@class='sitButton btn btn-primary']"
    SEAT_4 = "//div[@id='seat4']/div/div/button[@class='sitButton btn btn-primary']"
    SEAT_5 = "//div[@id='seat5']/div/div/button[@class='sitButton btn btn-primary']"

    ADD_CHIPS_INPUT = "//input[@id='amt']"
    ADD_CHIPS_BUTTON = "//button[@class='btn btn-primary btn-block' and contains(text(), 'Add Chips')]"

    RAISE_INPUT = "//input[@aria-label='Amount']"
    RAISE_BUTTON = "//button[@class='raiseButton actionItem btn btn-dark']"

    CALL_BUTTON = "//button[contains (text(), 'Call)]"