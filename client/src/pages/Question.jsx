import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./Question.css";
import {
  FaUser,
  FaCalendarAlt,
  FaSpinner,
  FaPaperPlane,
  FaComments,
} from "react-icons/fa";

function Question() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { question_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [question_id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setIsLoading(true);
      const questionRes = await axios.get(`/questions/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (questionRes.data.question) {
        setQuestion(questionRes.data.question);
        const answersRes = await axios.get(`/answers/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(answersRes.data.answers || []);
      }
    } catch (error) {
      setError("Failed to load question data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      setIsSubmitting(true);
      await axios.post(
        "/answers",
        {
          questionid: question_id,
          answer: newAnswer.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewAnswer("");
      await fetchQuestionAndAnswers();
    } catch (error) {
      setError("Failed to post answer");
      console.error("Error posting answer:", error);
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
      <div className="question-page loading-container">
        <div className="loading">
          <FaSpinner className="spinner-icon" /> Loading question...
        </div>
      </div>
    );
  }

  return (
    <div className="question-page">
      {error && <div className="error-message">{error}</div>}

      <div className="question-details">
        <h2>{question?.title}</h2>
        <div className="question-content">
          <p>{question?.description}</p>
        </div>
        <div className="question-meta">
          <div className="meta-item">
            <FaUser className="meta-icon" />
            <span>Asked by: {question?.username}</span>
          </div>
          {question?.created_at && (
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>{formatDate(question.created_at)}</span>
            </div>
          )}
        </div>
      </div>

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
            <div
              key={answer.answer_id || answer.answerid}
              className="answer-item"
            >
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
                <FaPaperPlane className="button-icon" /> Submit Answer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Question;
