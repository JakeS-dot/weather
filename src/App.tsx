import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Weather from "./Home";

const Main = lazy(() => import("./Weather"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Weather />} />
      <Route
        path="/main"
        element={
          <Suspense fallback={null}>
            <Main />
          </Suspense>
        }
      />
    </Routes>
  );
}
