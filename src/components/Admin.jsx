import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { Hash } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();
  const [team_details, setTeamDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTeamDetails() {
    const res = await fetch("http://localhost:8080/api/allTeams");
    const {data} = await res.json();
    console.log(data);
    
    setTeamDetails(data);
    setLoading(false);
  }

  useEffect(() => {
    if (localStorage.getItem("user_id") != "ace.csesvce23@gmail.com") {
      navigate("/admin-login");
    } else {
      fetchTeamDetails();
    }
  }, [navigate]);

  const hashPositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`
    }));
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="admin-homepage">
      {hashPositions.map((pos, i) => (
        <div
          key={i}
          className="animate-float"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: pos.duration
          }}
        >
          <Hash className="hash-icon" />
        </div>
      ))}
      <h2 className="title">CODE BINGO</h2>
      <div className="team-details">
        {team_details.map((team) => (
          <div key={team.teamName} className="each-team" onClick={()=>{navigate(`/admin/${team.teamName}`)}}>
            <h2>{team.teamName}</h2>
            <div className="bingo">
              <h4 className={`bingo-admin-letter ${team.bingoStatus >= 1 && 'finish'}`}>B</h4>
              <h4 className={`bingo-admin-letter ${team.bingoStatus >= 2 && 'finish'}`}>I</h4>
              <h4 className={`bingo-admin-letter ${team.bingoStatus >= 3 && 'finish'}`}>N</h4>
              <h4 className={`bingo-admin-letter ${team.bingoStatus >= 4 && 'finish'}`}>G</h4>
              <h4 className={`bingo-admin-letter ${team.bingoStatus >= 5 && 'finish'}`}>O</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
