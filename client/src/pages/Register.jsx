import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosBase from "../axiosConfig";
import { validateRegister } from "../utils/validation";
import Spinner from "../components/Spinner";
import About from "./About";
import backgroundImage from "../Images/background.svg";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const usernameValue = usernameDom.current.value;
    const firstValue = firstnameDom.current.value;
    const lastValue = lastnameDom.current.value;
    const emailValue = emailDom.current.value;
    const passValue = passwordDom.current.value;

    const validationErrors = validateRegister(
      usernameValue,
      firstValue,
      lastValue,
      emailValue,
      passValue
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosBase.post("/users/register", {
        username: usernameValue,
        firstname: firstValue,
        lastname: lastValue,
        email: emailValue,
        password: passValue,
      });
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Something went wrong!";
      setErrors({ submit: errorMessage });
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
            <h4>Join the network</h4>
            <p>
              Already have an account?
              <Link to="/login" className="create">
                Sign in
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
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
              <div className="input-group">
                <input
                  ref={firstnameDom}
                  className={`first-name ${errors.firstname ? "invalid" : ""}`}
                  type="text"
                  placeholder="First Name"
                  style={{ padding: "10px" }}
                />
                <input
                  ref={lastnameDom}
                  className={`last-name ${errors.lastname ? "invalid" : ""}`}
                  type="text"
                  placeholder="Last Name"
                  style={{ padding: "10px" }}
                />
              </div>
              {errors.firstname && (
                <small className="text-danger">{errors.firstname}</small>
              )}
              {errors.lastname && (
                <small className="text-danger">{errors.lastname}</small>
              )}
              <input
                ref={usernameDom}
                type="text"
                className={errors.username ? "invalid" : ""}
                placeholder="Username"
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
              {errors.username && (
                <small className="text-danger">{errors.username}</small>
              )}
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
                <small className="text-danger">{errors.password}</small>
              )}
              <p>
                I agree to the{" "}
                <a
                  className="create"
                  href="https://www.evangadi.com/legal/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>{" "}
                and{" "}
                <a
                  className="create"
                  href="https://www.evangadi.com/legal/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms of service.
                </a>
              </p>
              {errors.submit && (
                <div className="text-danger">{errors.submit}</div>
              )}
              <button type="submit" className="login__signInButton">
                Agree and Join
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

export default Register;
