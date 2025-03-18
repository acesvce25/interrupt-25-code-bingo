import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, Sparkles, Code2 } from "lucide-react";
import "../styles/Login.css";

function Login() {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const hashPositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important for JSON data
        },
        body: JSON.stringify({ team_name: teamName }),
      });
      localStorage.setItem("user_id", teamName);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      
      setIsLoading(false);
      setErrorMessage("An error occurred while fetching team names. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="background-container">
        {hashPositions.map((pos, i) => (
          <div
            key={i}
            className="animate-float"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: pos.delay,
              animationDuration: pos.duration,
            }}
          >
            <Hash className="hash-icon" />
          </div>
        ))}
      </div>

      <div className="card">
        <div className="header">
          <div className="logo-container">
            <Code2 className="logo" />
            <Sparkles className="sparkle" />
          </div>
          <h1 className="title">Code Bingo</h1>
          <p className="subtitle">Enter your team name to begin the challenge</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="input" placeholder="Team Name" required />
          </div>

          <button type="submit" disabled={isLoading || showSuccess} className="button">
            {isLoading ? (
              <span className="loading-spinner">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : showSuccess ? (
              "Welcome aboard! 🎉"
            ) : (
              "Join the Challenge"
            )}
          </button>
        </form>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {showSuccess && <div className="success-message">Successfully registered! Get ready to code! 🚀</div>}
      </div>
    </div>
  );
}

export default Login;
