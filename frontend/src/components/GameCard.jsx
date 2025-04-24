export default function GameCard({ game }) {
  const hasResult = game.Actual_winner !== undefined && game.Actual_winner !== null;

  const isCorrect = hasResult && game.Actual_winner === game.Predicted_winner;
  const isIncorrect = hasResult && game.Actual_winner !== game.Predicted_winner;

  let resultClass = "pending";
  if (isCorrect) resultClass = "correct";
  else if (isIncorrect) resultClass = "incorrect";

  return (
    <div className={`game-card ${resultClass}`}>
      <h3>{game.Matchup}</h3>
      <p>🏆 Predicted Winner: <strong>{game.Predicted_Winner}</strong></p>
      <p>📊 Home: {game.Home_Prob} | Away: {game.Away_Prob}</p>
      <p>🚑 Home Injuries: {Array.isArray(game.Home_injuries) ? game.Home_injuries.join(', ') : game.Home_injuries}</p>
      <p>🚑 Away Injuries: {Array.isArray(game.Away_injuries) ? game.Away_injuries.join(', ') : game.Away_injuries}</p>

      <p>
        🧾 Final Score:&nbsp;
        {hasResult
          ? `${game.Away_score} - ${game.Home_score} | Winner: ${game.Actual_winner}`
          : <span style={{ fontStyle: "italic", color: "#999" }}>Pending</span>}
      </p>
    </div>
  );
}
