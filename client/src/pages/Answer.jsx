import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axiosConfig";
import { AppState } from "../App";
import "./Answer.css";
import {
  FaUser,
  FaCalendarAlt,
  FaSpinner,
  FaPaperPlane,
  FaComments,
  FaArrowLeft,
} from "react-icons/fa";

function Answer() {
  const { user } = useContext(AppState);
  const { questionid } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadQuestionAndAnswers();
  }, [questionid]);

  const loadQuestionAndAnswers = async () => {
    try {
      setIsLoading(true);
      const questionResponse = await axios.get(`/questions/${questionid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(questionResponse.data.question);

      const answersResponse = await axios.get(`/answers/${questionid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(answersResponse.data.answers || []);
      setError("");
    } catch (error) {
      console.log("API Error:", error.response?.data);
      setError("Failed to load question and answers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "/answers",
        {
          answer: newAnswer.trim(),
          questionid: parseInt(questionid),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setNewAnswer("");
        await loadQuestionAndAnswers();
      }
    } catch (error) {
      console.log("Submit error:", error);
      setError("Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="answer-container loading-container">
        <div className="loading">
          <FaSpinner className="spinner-icon" /> Loading question...
        </div>
      </div>
    );
  }

  return (
    <div className="answer-container">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to Questions
      </Link>

      {error && <div className="error-message">{error}</div>}

      {question && (
        <div className="question-section">
          <h2>{question.title}</h2>
          <div className="question-content">
            <p>{question.description}</p>
          </div>
          <div className="question-meta">
            <div className="meta-item">
              <FaUser className="meta-icon" />
              <span>Asked by: {question.username || question.user_name}</span>
            </div>
            {question.created_at && (
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>{formatDate(question.created_at)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="answers-section">
        <h3>
          <FaComments className="section-icon" />
          Answers ({answers.length})
        </h3>

        {answers.length === 0 ? (
          <div className="no-answers">
            <p>No answers yet. Be the first to answer this question!</p>
          </div>
        ) : (
          answers.map((answer) => (
            <div key={answer.answerid} className="answer-item">
              <div className="answer-content">
                <p>{answer.answer}</p>
              </div>
              <div className="answer-meta">
                <div className="meta-item">
                  <FaUser className="meta-icon" />
                  <span>{answer.user_name}</span>
                </div>
                {answer.created_at && (
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span>{formatDate(answer.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="answer-form">
        <h3>Your Answer</h3>
        <form onSubmit={handleSubmitAnswer}>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner-icon" /> Posting...
              </>
            ) : (
              <>
                <FaPaperPlane className="button-icon" /> Post Answer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Answer;
