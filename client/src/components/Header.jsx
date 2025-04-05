import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../App";
import "./Header.css";
import logo from "../Images/evangadi-logo-header.png";

function Header() {
  const { user, setuser } = useContext(AppState);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setuser({});
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Evangadi Logo" className="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span>
            <i
              className="fas fa-bars"
              style={{ color: "black", fontSize: "1.5em" }}
            ></i>
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link black link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/howitworks" className="nav-link black link">
                How it works
              </Link>
            </li>
            {user?.username ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link black link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-success" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
