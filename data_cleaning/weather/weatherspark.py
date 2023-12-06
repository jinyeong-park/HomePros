from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from PIL import Image

import time
import os

def get_average_weather(city, state):
    os.environ['MOZ_HEADLESS'] = '1'
    driver = webdriver.Firefox()
    web = driver.get("https://weatherspark.com/")

    input_element = driver.find_element(by=By.CSS_SELECTOR, value='.LiveSearch-field')

    input_element.send_keys(f"{city}, {state}")
    time.sleep(1)
    input_element.send_keys(Keys.ENTER)
    time.sleep(3)
    driver.save_screenshot(f'{city}-{state}.png')
    print(driver.current_url)
    driver.quit()

def crop_image(city, state):
    im = Image.open(f'{city}-{state}.png')
    width, height = im.size

    left = 185
    top = 350
    right = 1020
    bottom = 720
    
    # Cropped image of above dimension
    # (It will not change original image)
    im1 = im.crop((left, top, right, bottom))
    im1.save(f'{city}-{state}-cropped.png')


if __name__ == "__main__":
    get_average_weather('San Francisco','CA')
    crop_image('San Francisco','CA')

    get_average_weather('Los Angeles','CA')
    crop_image('Los Angeles','CA')