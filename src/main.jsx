import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StudyGuide from "./StudyGuide.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StudyGuide />
  </StrictMode>
);
