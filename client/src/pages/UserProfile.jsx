import { useState, useEffect, useContext } from "react";
import { AppState } from "../App";
import axios from "../axiosConfig";
import "./UserProfile.css";
import { FaUser, FaEnvelope, FaQuestion, FaSpinner } from "react-icons/fa";

function UserProfile() {
  const { user } = useContext(AppState);
  const [userQuestions, setUserQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user.userid) {
      fetchUserQuestions();
    }
  }, [user.userid, token]);

  const fetchUserQuestions = async () => {
    try {
      const response = await axios.get(`/questions/user/${user.userid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Error fetching user questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <div className="user-info">
          <p>
            <strong>
              <FaUser style={{ marginRight: "8px" }} /> Username:
            </strong>{" "}
            {user.username}
          </p>
          <p>
            <strong>
              <FaEnvelope style={{ marginRight: "8px" }} /> Email:
            </strong>{" "}
            {user.email || "Email not available"}
          </p>
        </div>
      </div>

      <div className="user-questions">
        <h3>
          <FaQuestion style={{ marginRight: "8px" }} /> Your Questions
        </h3>

        {isLoading ? (
          <div className="loading">
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} />{" "}
            Loading your questions...
          </div>
        ) : userQuestions.length > 0 ? (
          userQuestions.map((question) => (
            <div
              key={question.question_id || question.id}
              className="question-item"
            >
              <h4>{question.title}</h4>
              <p>{question.description}</p>
              <small>
                Posted on:{" "}
                {question.created_at
                  ? new Date(question.created_at).toLocaleDateString()
                  : "Date not available"}
              </small>
            </div>
          ))
        ) : (
          <p>You haven't asked any questions yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
