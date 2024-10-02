import React, { useState, useEffect } from 'react';
import './App.css';
import questions from './questions';

function App() {
  const [votes, setVotes] = useState(() => {
    const savedVotes = localStorage.getItem('votes');
    return savedVotes ? JSON.parse(savedVotes) : {};
  });

  const [hasVoted, setHasVoted] = useState(() => {
    const savedHasVoted = localStorage.getItem('hasVoted');
    return savedHasVoted ? JSON.parse(savedHasVoted) : {};
  });

  useEffect(() => {
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem('hasVoted', JSON.stringify(hasVoted));
  }, [votes, hasVoted]);

  const vote = (questionId, option) => {
    if (!hasVoted[questionId]) {
      setVotes(prevVotes => ({
        ...prevVotes,
        [questionId]: {
          ...prevVotes[questionId],
          [option]: (prevVotes[questionId]?.[option] || 0) + 1
        }
      }));
      setHasVoted(prevHasVoted => ({
        ...prevHasVoted,
        [questionId]: true
      }));
    }
  };

  const getTotalVotes = (questionId) => {
    const questionVotes = votes[questionId] || {};
    return Object.values(questionVotes).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (questionId, option) => {
    const totalVotes = getTotalVotes(questionId);
    if (totalVotes === 0) return 0;
    return ((votes[questionId]?.[option] || 0) / totalVotes) * 100;
  };

  const getEmoji = (option) => {
    const emojiMap = {
      'With others': '👥',
      'By yourself': '🧍',
      'A harmonious relationship with nature': '🌿',
      'Cutting-edge technology': '🖥️',
      'A hopeful, sustainable utopia': '🌈',
      'A gritty, dystopian future': '🏙️',
      'A post-capitalist, eco-conscious lifestyle': '🌱',
      'A corporate-driven, capitalist environment': '💼',
      'Rustic, green aesthetics': '🌳',
      'Neon-lit, chrome visuals': '🌆',
      'Bikes': '🚲',
      'Cars': '🚗',
      'Locally sourced and organic': '🥕',
      'GMO and mass-produced': '🏭',
      'A hopeful world striving for improvement': '🌟',
      'A pessimistic world where survival is the primary concern': '🔥',
      'Sustainable and self-sufficient': '🏡',
      'high-tech smart home': '🏠',
      'Restore animal & plant species': '🐾',
      'Enhance humans with tech': '🦾'
    };
    return emojiMap[option] || '';
  };

  const getWinningOptionIndex = (questionId) => {
    const options = questions.find(q => q.id === questionId).options;
    const percentages = options.map(option => ({
      option,
      percentage: getPercentage(questionId, option)
    }));
    percentages.sort((a, b) => b.percentage - a.percentage);
    return options.indexOf(percentages[0].option);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('votes');
    localStorage.removeItem('hasVoted');
    setVotes({});
    setHasVoted({});
  };

  return (
    <div className="container">
      <header>
        <h1>CyberPunk or SolarPunk</h1>
        <p></p>
        <button onClick={clearLocalStorage}>Reset All Votes</button>
      </header>

      <div className="questions-section">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className="question-box">
            <h2>{question.text}</h2>
            {hasVoted[question.id] && (
              <>
                <h3 className="decision-header">The Internet Has Decided</h3>
                <p className="custom-answer">
                  {question.customAnswers[getWinningOptionIndex(question.id)]}
                </p>
              </>
            )}
            <div className="options-container">
              {!hasVoted[question.id] ? (
                question.options.map(option => (
                  <button
                    key={option}
                    className="option"
                    onClick={() => vote(question.id, option)}
                  >
                    {getEmoji(option)} {option}
                  </button>
                ))
              ) : (
                <>
                  <div className="result-bar-wrapper">
                    {question.options.map((option, index) => {
                      const percentage = getPercentage(question.id, option);
                      return (
                        <div
                          key={option}
                          className={`bar ${index === 0 ? 'left-bar' : 'right-bar'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="percentage-container">
                    {question.options.map((option, index) => {
                      const percentage = getPercentage(question.id, option);
                      return (
                        <p key={option} className={index === 0 ? 'left-align' : 'right-align'}>
                          {getEmoji(option)} {option} ({percentage.toFixed(1)}%)
                        </p>
                      );
                    })}
                  </div>
                  <div className={`total-votes ${questionIndex === 0 ? 'first-total-votes' : ''}`}>
                    Total votes: {getTotalVotes(question.id).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
