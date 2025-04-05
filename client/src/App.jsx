import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState, createContext, useCallback } from "react";
import axios from "./axiosConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import Question from "./pages/Question";
import Answer from "./pages/Answer";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import HowItWorks from "./pages/HowItWorks";

export const AppState = createContext();

function App() {
  const [user, setuser] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setuser(data.user);
    } catch (error) {
      console.log("Error:", error.response);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const publicPaths = ["/login", "/register"];
    const currentPath = window.location.pathname;

    if (token) {
      checkUser();
    } else if (!publicPaths.includes(currentPath)) {
      navigate("/login");
    }
  }, [token, navigate, checkUser]);

  return (
    <AppState.Provider value={{ user, setuser }}>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={token ? <Home /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/answer/:questionid"
              element={token ? <Answer /> : <Login />}
            />
            <Route
              path="/profile"
              element={token ? <UserProfile /> : <Login />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/howitworks" element={<HowItWorks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppState.Provider>
  );
}

export default App;
