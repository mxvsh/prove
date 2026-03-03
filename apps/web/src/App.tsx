import { BrowserRouter, Routes, Route } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { ProjectListPage } from "./pages/ProjectListPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { VerdictPage } from "./pages/VerdictPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/project/:id" element={<WorkspacePage />} />
        <Route path="/project/:id/verdict" element={<VerdictPage />} />
      </Routes>
    </BrowserRouter>
  );
}
