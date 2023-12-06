import requests

class WeatherWrapper:
    
    def __init__(self, latitude:float, longitude:float):
        self.latitude = latitude
        self.longitude = longitude
        self.city_data = self.get_city_data()
        self.weather_data = self.get_weather_from_city_data()
        self.periods = self.get_periods()

    def get_city_data(self):
        response = requests.get(f"https://api.weather.gov/points/{self.latitude},{self.longitude}")
        city_data = response.json()
        return city_data

    def get_weather_from_city_data(self):
        response = requests.get(self.city_data['properties']['forecast'])
        weather_data = response.json()
        return weather_data

    def get_periods(self):
        return self.weather_data['properties']['periods']

    # def get_current_day_weather(self):
    #     return self.weather_data['properties']['periods'][0]['temperature']

    # def get_current

if __name__ == "__main__":
    weather = WeatherWrapper(34.1141, -118.4068)
    print(weather.get_periods())