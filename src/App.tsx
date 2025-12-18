import { Routes, Route } from "react-router-dom";
import Weather from "./Home";
import Main from "./Weather"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </>
  );
}
