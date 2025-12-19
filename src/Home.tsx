import { useState, useEffect } from "react";
import "./Home.css";
import { useWeather } from "./hooks/Api.tsx";
import type { WeatherData } from "./hooks/Api.tsx";

export default function Weather() {
  const weather: WeatherData | null = useWeather();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const baseWidth = 950;
      const baseHeight = 500;
      const scaleX = window.innerWidth / baseWidth;
      const scaleY = (window.innerHeight * 0.98) / baseHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="black-box">
      <div className="inner-box-wrapper">
        <div className="inner-box" style={{ transform: `scale(${scale})` }}>
          {/* your full inner-box content here */}
          <div className="top-bar">
            <div className="logo">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Weathernews_company_logo.svg/960px-Weathernews_company_logo.svg.png?20220412161204"
                alt="Weathernews_company_logo"
              />
            </div>
            <div className="title">Forecast Channel</div>
          </div>

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
            <div className="forecast-image">
              {weather ? (
                <img src={`${weather.image}`} alt="Weather" />
              ) : (
                "Loading..."
              )}
            </div>
          </div>

          <div className="forecast-footer">
            <div className="support">supported by weathernews</div>
            <div className="time">
              {weather ? weather.timestamp : "Loading..."}
            </div>
          </div>

          <div className="start-buttons-box">
            <div className="start-buttons-container">
              <div className="start-button" id="wii-menu">
                <img src="/bitmap.svg" className="shine" />
                <div className="button-content">
                  <p>Wii Menu</p>
                </div>
              </div>
              <div className="start-button" id="start">
                <img src="/bitmap.svg" className="shine" />
                <div className="button-content">
                  <a href="/main">
                    <p>Start</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
