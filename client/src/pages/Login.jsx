import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../App";
import axiosBase from "../axiosConfig";
import { validateLogin } from "../utils/validation";
import Spinner from "../components/Spinner";
import About from "./About";
import backgroundImage from "../Images/background.svg";
import "./Login.css";

function Login() {
  const { setuser } = useContext(AppState);
  const emailDom = useRef();
  const passwordDom = useRef();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const emailValue = emailDom.current.value;
    const passValue = passwordDom.current.value;

    const validationErrors = validateLogin(emailValue, passValue);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosBase.post("/users/login", {
        email: emailValue,
        password: passValue,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axiosBase.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        // Get user data
        const { data } = await axiosBase.get("/users/check", {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        setuser(data.user);
        setErrors({});
        navigate("/");
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.msg ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="auth-layout">
        <div className="auth-form-container">
          <div className="login__container">
            <h4>Login to your account</h4>
            <p>
              Don't have an account?
              <Link to="/register" className="create">
                Create a new account
              </Link>
            </p>
            {isLoading && <Spinner />}
            <form onSubmit={handleSubmit}>
              <input
                ref={emailDom}
                type="email"
                className={errors.email ? "invalid" : ""}
                placeholder="Email"
                style={{ padding: "10px", marginBottom: "10px" }}
              />
              {errors.email && <div className="error">{errors.email}</div>}
              <div className="signinfas">
                <input
                  ref={passwordDom}
                  type={passwordVisible ? "text" : "password"}
                  className={`hide ${errors.password ? "invalid" : ""}`}
                  placeholder="Password"
                  style={{ padding: "10px" }}
                />
                <i onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <i className="fas fa-eye" />
                  ) : (
                    <i className="fas fa-eye-slash" />
                  )}
                </i>
              </div>
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
              {errors.submit && <div className="error">{errors.submit}</div>}
              <button type="submit" className="login__signInButton">
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="about-section-container">
          <About />
        </div>
      </div>
    </div>
  );
}

export default Login;
