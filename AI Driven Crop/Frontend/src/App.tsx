import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { DiseaseDetection } from "./pages/DiseaseDetection";
import { Results } from "./pages/Results";
import { Weather } from "./pages/Weather";
import {MandiRates} from "./pages/MandiRates";   // ✅ FIXED: no curly braces
import { HowItWorks } from "./pages/HowItWorks";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
// import { Signup } from "./pages/Signup";
// import { ForgotPassword } from "./pages/ForgotPassword";

export type DetectionResult = {
  diseaseName: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  cropType: string;
  image: string;
  treatments: {
    immediate: string[];
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  description: string;
  symptoms: string[];
};

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Backend connected:", data);
      })
      .catch((err) => {
        console.error("❌ Backend connection failed:", err);
      });
  }, []);

  const handleDetectionComplete = (result: DetectionResult) => {
    setDetectionResult(result);
    setCurrentPage("results");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <Landing onNavigate={setCurrentPage} />;
      case "login":
        return <Login onNavigate={setCurrentPage} />;
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "detect":
        return (
          <DiseaseDetection
            onDetectionComplete={handleDetectionComplete}
            onNavigate={setCurrentPage}
          />
        );
      case "results":
        return <Results result={detectionResult} onNavigate={setCurrentPage} />;
      case "weather":
        return <Weather onNavigate={setCurrentPage} />;
      case "mandi":
        return <MandiRates onNavigate={setCurrentPage} />;   // ✅ pass onNavigate if defined
      case "how-it-works":
        return <HowItWorks onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} currentPage={currentPage} />
    </div>
  );
}

export default App;