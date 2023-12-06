# HomePro

## 1. Introduction

Our website concept, **HomePros**, is your go-to platform for making the best decisions when it comes to finding your ideal place to live. We tackle the challenges of information overload and uninformed choices by harnessing housing data, economic factors, and social indicators.

_At HomePros, we use housing data, economic factors, and social indicators to help people find the best places to live. By analyzing trends in housing prices, tax burden, education, and safety, we provide valuable insights for informed decision-making about where to call home._

### Our Key Features:

- **Data-Driven Insights:** We analyze housing prices, safety records, tax info, weather, job opportunities, education options to provide you with valuable insights.
- **Personalized Recommendations:** Tailored to your preferences, our platform offers recommendations that align with your unique needs.
- **Simplified Decision-Making:** Say goodbye to the complexity of choice. We simplify the process, helping you make decisions with confidence.

### List of Features to Implement in the Application:

1. Show recommendations of a list of cities to live in based on editorial suggestions (based on pre-set filters).
2. Search by a city name, state name, and filter price ranges and crime scores, then get recommended cities to live in matching the search criteria.
3. Show city information by each specific city with avg. price to buy and rent a home, and relevant crime, weather and tax information, also visualize historical information with housing price trends.
4. Show states and what cities are in the states.

### List of Extra Features:

- Source and include education information.
- User login system, so the user can store favorite city/states.
- Allow users to review cities.
- Comparison feature to compare cities or states.

### List of Pages Description:

1. **Page 1 (Main):**

   - Display the top 10 cities (price under $500k-1m & safety score & weather.... ) and top 5 states by tax (based on State-Local Tax Burden).
   - Implement a simple search bar for a city or state.

2. **Page 2:**

   - Clicking into a city will provide average statistics that we have for the city including crime and weather data.
   - Visualization with the city’s historical house/rent data.
   - Advanced filtering option to search other cities and states.

3. **Page 3:**
   - Clicking into a state will provide average tax statistics for a state and the top 3-5 cities associated with the state.
   - Advanced filtering options to search other cities or states.

## 2. Architecture

### List of Technologies Used:

- AWS RDS
- MySQL
- Node.JS
- JavaScript
- ReactJS
