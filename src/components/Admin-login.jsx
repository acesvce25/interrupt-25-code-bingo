import { useState, useMemo } from "react";
import "../styles/admin-login.css";
import { Hash, Sparkles, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState({});
  const [error, setError] = useState("");

  const hashPositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
    }));
  }, []);

  function login(e) {
    e.preventDefault();
    if (userLogin.email === "ace.csesvce23@gmail.com" && userLogin.password === "LeelaAkkaMass@2025") {
      localStorage.setItem("user_id", userLogin.email);
      navigate("/admin");
    } else {
      setError("Invalid Credentials");
    }
  }

  return (
    <div className="container">
      <div className="background-container">
        {hashPositions.map((pos, index) => (
          <div
            key={index}
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
          <h1 className="title">Admin Login</h1>
        </div>
        <form onSubmit={login} className="form">
          <div className="input-group">
            <input type="email" placeholder="Enter your email" onChange={(e) => setUserLogin((prev) => ({ ...prev, email: e.target.value }))} className="input" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Enter your password" onChange={(e) => setUserLogin((prev) => ({ ...prev, password: e.target.value }))} className="input" required />
          </div>
          <button type="submit" className="button">
            LOGIN
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default AdminLogin;
