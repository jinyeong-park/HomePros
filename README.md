# HomePro

## 1. Introduction

Our website concept, **HomePros**, is your go-to platform for making the best decisions when it comes to finding your ideal place to live. We tackle the challenges of information overload and uninformed choices by harnessing housing data, economic factors, and social indicators.

_At HomePros, we use housing data, economic factors, and social indicators to help people find the best places to live. By analyzing trends in housing prices, tax burden, education, and safety, we provide valuable insights for informed decision-making about where to call home._

### Our Key Features:

- **Data-Driven Insights:** We analyze housing prices, safety records, tax info and weather to provide you with valuable insights.
- **Personalized Recommendations:** Tailored to your preferences, our platform offers recommendations that align with your unique needs.
- **Simplified Decision-Making:** Say goodbye to the complexity of choice. We simplify the process, helping you make decisions with confidence.

### List of Features to Implement in the Application:

1. Show recommendations of a list of cities to live in based on editorial suggestions (based on pre-set filters).
2. Search by a city name, state name, and filter price ranges and crime scores, then get recommended cities to live in matching the search criteria.
3. Show city information by each specific city with avg. price to buy and rent a home, and relevant crime, weather and tax information, also visualize historical information with housing price trends.
4. Show states and what cities are in the states.

### List of Extra Features:

- Integrated live hourly weather information for each city though an external API call to https://api.weather.gov/points/${latitude},${longitude} and polls every 20 minutes for updates
- Pulling images for each city from an external API where `imgSource` is a combination of city and state https://source.unsplash.com/random/1280x720/?${imgSource},USA

### List of Pages Description:

1. **Page 1 (Main):**

   - This is the main page where users can search for city and/or state. This page has two search boxes. The user can enter a city and the state or just a state and hit search. Upon searching the user will be redirected to the state or cities information page.

2. **Page 2 (StateInfoPage):**

- This page shows a detailed overview of a state including some key statistics in a table on the left of the page and an interactive map showing the index scores of the cities in that state.

3. **Page 3 (CityPage):**

   - This page shows a detailed overview of a city including some key statistics in a table on the left of the page and an interactive map showing the location of the city.

4. **Page 4 (Cities):**

   - The page can be accessed through the navigation bar and shows all the cities with an option for advanced search criteria.
   - The advanced search includes the fields tax burden, average home price, average rent price, total crime, and population.
   - You can also sort results by each of the factors in ascending order. Each card also has the city's current weather and can be clicked to lead to the city specific information page.

5. **Page 5 (States):**
   - The page can be accessed through the navigation bar and shows all the states linking each state to the StateInfoPage.
   - The state cards can be sorted by tax burden, alphabetically, index score, or total crime in ascending order.

## 2. Architecture

### List of Technologies Used:

- AWS RDS (MySQL)
- Node.JS
- JavaScript
- ReactJS

## Demo

https://drive.google.com/file/d/1hQr75ejrSfqmQsGSBiXHrfwL0O62pPLM/view?usp=drive_link

## Build Instructions

1. Clone repository
2. Navigate to the server folder in terminal and enter `npm i`
3. Run `npm start` to start the server
3. Navigate to the client folder in terminal and enter `npm i`
4. Run `npm run build` in the client folder
5. Run `serve -s build` to start a local version of the frontend
6. Navigate to `http://localhost:3000`
