import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hash } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert2
import data from "../data/data.json";
import "../styles/admin-team-page.css";

function AdminTeamPage() {
  const { team_id: team_name } = useParams();
  const [teamSolved, setTeamSolved] = useState([]);
  const navigate = useNavigate();
  const [bingoStatus, setBingoStatus] = useState(1);
  const [loading, setLoading] = useState(true);

  // Create hash positions similar to Home
  const hashPositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
    }));
  }, []);

  // Compute winning (completed) cells: if an entire row or column is solved, mark those cells.
  const winningCells = useMemo(() => {
    const winCells = Array(25).fill(false);
    // Check rows
    for (let row = 0; row < 5; row++) {
      let complete = true;
      for (let col = 0; col < 5; col++) {
        if (!teamSolved.includes(row * 5 + col + 1)) {
          complete = false;
          break;
        }
      }
      if (complete) {
        for (let col = 0; col < 5; col++) {
          winCells[row * 5 + col] = true;
        }
      }
    }
    // Check columns
    for (let col = 0; col < 5; col++) {
      let complete = true;
      for (let row = 0; row < 5; row++) {
        if (!teamSolved.includes(row * 5 + col + 1)) {
          complete = false;
          break;
        }
      }
      if (complete) {
        for (let row = 0; row < 5; row++) {
          winCells[row * 5 + col] = true;
        }
      }
    }
    return winCells;
  }, [teamSolved]);

  // Helper function to calculate the bingo status
  function isSolved(num) {
    const bingoCells = Array(25).fill(false);
    for (let item of teamSolved) {
      bingoCells[item - 1] = true;
    }
    if (num) {
      bingoCells[num - 1] = true;
    }
    let rowComplete = 0;
    for (let row = 0; row < 5; row++) {
      let temp = 0;
      for (let col = 0; col < 5; col++) {
        if (bingoCells[row * 5 + col]) {
          temp++;
        }
      }
      if (rowComplete < temp) rowComplete = temp;
    }
    let colComplete = 0;
    for (let col = 0; col < 5; col++) {
      let temp = 0;
      for (let row = 0; row < 5; row++) {
        if (bingoCells[col + row * 5]) {
          temp++;
        }
      }
      if (colComplete < temp) colComplete = temp;
    }
    return rowComplete > colComplete ? rowComplete : colComplete;
  }

  async function updateParticipant(id) {
    const newBingoStatus = isSolved(id);
    // Optimistically update the state
    setTeamSolved((prev) => [...prev, id]);
    setBingoStatus(newBingoStatus);
    try {
      await fetch(`http://localhost:8080/api/updateDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_name,
          id,
          bingoStatus: newBingoStatus,
        }),
      });
    } catch (error) {
      console.error("Failed to update participant:", error);
      // Optionally revert the optimistic update if needed
      setTeamSolved((prev) => prev.filter((item) => item !== id));
      setBingoStatus(isSolved(null));
    }
  }

  // Use SweetAlert2 for a custom confirmation prompt
  function handleSolvedConfirmation(id) {
    Swal.fire({
      title: `Mark question ${id} as solved?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as solved!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        updateParticipant(id);
      }
    });
  }

  useEffect(() => {
    if (localStorage.getItem("user_id") === "ace.csesvce23@gmail.com") {
      async function fetchTeamDetails() {
        try {
          const res = await fetch(`http://localhost:8080/api/findUserDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ team_name }),
          });
          const data = await res.json();
          setTeamSolved(data.solved);
          setBingoStatus(data.bingoStatus);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching team details:", error);
        }
      }
      fetchTeamDetails();
    } else {
      navigate("/admin-login");
    }
  }, [navigate, team_name]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="home-container">
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

      <h1 className="title">CODE BINGO</h1>
      <h2 className="title">{team_name}</h2>

      <div className="bingo-grid">
        {data.map((box) => (
          <div
            key={box.id}
            className={`bingo-cell ${teamSolved.includes(box.id) ? "active" : ""} ${
              winningCells[box.id - 1] ? "completed" : ""
            }`}
          >
            <div className="cell-content">
              <span
                className="cell-number"
                onClick={() => window.open(box.url, "_blank")}
              >
                {box.id}
              </span>
              {!teamSolved.includes(box.id) && (
                <button
                  className="solved-btn"
                  onClick={() => handleSolvedConfirmation(box.id)}
                >
                  Solved
                </button>
              )}
              {teamSolved.includes(box.id) && <div className="cell-overlay"></div>}
            </div>
          </div>
        ))}
      </div>

      <div className="bingo-word-container">
        <div className="bingo-word">
          {["B", "I", "N", "G", "O"].map((letter, idx) => (
            <span
              key={idx}
              className={`bingo-letter ${bingoStatus >= idx + 1 ? "crossed" : ""}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminTeamPage;
