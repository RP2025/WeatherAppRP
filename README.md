# WeatherApp

A dynamic weather forecasting application built using **React** and **Vite**. The app leverages a weather API to provide real-time weather updates for multiple cities, featuring an auto-scrolling section and a search functionality for user-specified cities.

## 🌟 Features

- **Real-Time Weather Updates:** Displays temperature, humidity, wind speed, and weather conditions for searched cities.  
- **Auto-Scrolling City Weather:** A carousel that automatically scrolls through weather updates for predefined cities.  
- **Search Functionality:** Allows users to search for weather updates for any city worldwide.  
- **Responsive Design:** Optimized for various screen sizes for a seamless user experience.  
- **Weather Icons:** Displays dynamic icons based on weather conditions.  

## 🔧 Technologies Used

- **Frontend:** React (with Vite for development setup)  
- **API Integration:** OpenWeatherMap API  
- **Styling:** CSS (custom styling)  

## 🚀 Getting Started

Follow these instructions to set up the project locally:

### Prerequisites

- **Node.js** (v14 or higher)  
- **npm** or **yarn**  
- OpenWeatherMap API Key  

### Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/RP2025/WeatherAppRP.git
   cd WeatherAppRP
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Create an `.env` file in the root directory and add your API key:  
   ```
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   ```
4. Start the development server:  
   ```bash
   npm run dev
   ```
5. Open the app in your browser:  
   ```
   http://localhost:5173
   ```

## 📸 Screenshots

### Main Interface
TBA

## 🌐 API Used

- **[OpenWeatherMap API](https://openweathermap.org/):** Provides accurate and real-time weather data for cities around the world.

## 📂 Project Structure

```plaintext
WeatherAppRP/
├── src/
│   ├── assets/             # Weather icons and other assets
│   ├── App.jsx             # Main app file
│   ├── components/         # React components
│       ├── main.jsx        # Weather component
│       ├── Weather.css     # Styling for the Weather component
├── public/                 # Static files
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
```

