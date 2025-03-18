import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { Hash } from 'lucide-react';
import qn from "../data/data.json";

function Home() {
  const navigate = useNavigate();
  const teamName = localStorage.getItem('user_id');
  const [bingoCells, setBingoCells] = useState(Array(25).fill(false));
  const [urls, setUrls] = useState(Array(25).fill(''));

  useEffect(() => {
    if (!teamName) {
      navigate('/login');
    } else {
      const fetchUserSolvedQns = async () => {
        try {
          const response = await fetch('https://interrupt-25-code-bingo-server.vercel.app/api/findUserDetails', {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Important for JSON data
            },
            body: JSON.stringify({ team_name: teamName })
          });
          const data = await response.json();
          
          const newUrls = qn.map(item => item.url);
          const newBingoCells = Array(25).fill(false);
          for(let item of data.solved){
            newBingoCells[item-1] = true;
          }
          console.log(newBingoCells);
          
          setUrls(newUrls);
          setBingoCells(newBingoCells);
        } catch (error) {
          console.error('Error fetching user solved questions:', error);
        }
      };
      fetchUserSolvedQns();
    }
  }, [teamName, navigate]);

  const handleCellClick = (index) => {
    if (!bingoCells[index]) {
      window.open(urls[index], '_blank');
    }
  };

  const winCount = useMemo(() => {
    // Check rows
    let rowComplete = 0;
    for (let row = 0; row < 5; row++) {
      let temp = 0;
      for (let col = 0; col < 5; col++) {
        if (bingoCells[row * 5 + col]) {
          temp++;
        }
      }
      if (rowComplete < temp){
        rowComplete = temp;
      }
    }
    let colComplete = 0;
    // Check columns
    for (let col = 0; col < 5; col++) {
      let temp = 0;
      for (let row = 0; row < 5; row++) {
        if (bingoCells[col + row * 5]) {
          temp++;
        }
      }
      if (colComplete < temp) {
        colComplete = temp;
      }
    }
    
    return rowComplete > colComplete ? rowComplete : colComplete;
  }, [bingoCells]);

  const crossedLetters = useMemo(() => {
    return ['B', 'I', 'N', 'G', 'O'].map((_, index) => winCount > index);
  }, [winCount]);

  const winningCells = useMemo(() => {
    const winCells = Array(25).fill(false);
    // Rows
    for (let row = 0; row < 5; row++) {
      let complete = true;
      for (let col = 0; col < 5; col++) {
        if (!bingoCells[row * 5 + col]) {
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
    // Columns
    for (let col = 0; col < 5; col++) {
      let complete = true;
      for (let row = 0; row < 5; row++) {
        if (!bingoCells[col + row * 5]) {
          complete = false;
          break;
        }
      }
      if (complete) {
        for (let row = 0; row < 5; row++) {
          winCells[col + row * 5] = true;
        }
      }
    }
    
    return winCells;
  }, [bingoCells]);

  const hashPositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`
    }));
  }, []);

  if (!teamName) return null;

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
            animationDuration: pos.duration
          }}
        >
          <Hash className="hash-icon" />
        </div>
      ))}

      <h1 className="home-title">CODE BINGO</h1>
      <h2 className="home-team-name">Welcome, {teamName}!</h2>

      <div className="bingo-grid">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={`bingo-cell ${bingoCells[index] ? 'active' : ''} ${winningCells[index] ? 'completed' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            <span className="cell-number">{index + 1}</span>
            {bingoCells[index] && <div className="cell-overlay"></div>}
          </div>
        ))}
      </div>

      <div className="bingo-word-container">
        <div className="bingo-word">
          {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
            <span
              key={index}
              className={`bingo-letter ${crossedLetters[index] ? 'crossed' : ''}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
