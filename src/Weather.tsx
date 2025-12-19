import "./Weather.css";
import { useWeather } from "./hooks/Api.tsx";
import type { WeatherData } from "./hooks/Api.tsx";

export default function Main() {
  const weather: WeatherData | null = useWeather();
  return (
    <>
      <div className="black-box">
        <nav className="top-nav">
          <div className="blank"></div>
          <div className="upper-time"></div>
          <div className="settings"></div>
        </nav>
        <main>
          <div className="forecast-bar">
            <div className="current">CURRENT</div>
            <div className="location">
              <div className="location-corner"></div>
              <div id="location-inner">{weather?.city}</div>
            </div>
          </div>
          <div className="forecast-container">
            <div className="forecast-info">
              <div id="temp">
                {weather ? (
                  <>
                    {weather.temperature}
                    <span className="degree-symbol">°</span>
                  </>
                ) : (
                  "Loading..."
                )}
              </div>
              <div id="conditions">
                {weather ? weather.condition : "Loading..."}
              </div>
            </div>
            <div className="img-container">
              <div className="forecast-image">
                {weather ? (
                  <img src={`${weather.image}`} alt="Weather" />
                ) : (
                  "Loading..."
                )}
              </div>
              <div className="winds">
<p>SW 3 mph</p>
              </div>
            </div>
          </div>
          <div className="forecast-footer">
            <div className="support">supported by weathernews</div>
            <div className="time">
              {weather ? weather.timestamp : "Loading..."}
            </div>
          </div>
        </main>
        <nav className="bottom-nav"></nav>
      </div>
    </>
  );
}
