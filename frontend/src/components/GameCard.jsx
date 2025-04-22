export default function GameCard({ game }) {
  const hasResult = game.actual_winner !== undefined && game.actual_winner !== null;

  const isCorrect = hasResult && game.actual_winner === game.Predicted_Winner;
  const isIncorrect = hasResult && game.actual_winner !== game.Predicted_Winner;

  let resultClass = "pending";
  if (isCorrect) resultClass = "correct";
  else if (isIncorrect) resultClass = "incorrect";

  return (
    <div className={`game-card ${resultClass}`}>
      <h3>{game.Matchup}</h3>
      <p>🏆 Predicted Winner: <strong>{game.Predicted_Winner}</strong></p>
      <p>📊 Home: {game.Home_Prob} | Away: {game.Away_Prob}</p>
      <p>🚑 Home Injuries: {Array.isArray(game.Home_Injuries) ? game.Home_Injuries.join(', ') : game.Home_Injuries}</p>
      <p>🚑 Away Injuries: {Array.isArray(game.Away_Injuries) ? game.Away_Injuries.join(', ') : game.Away_Injuries}</p>

      <p>
        🧾 Final Score:&nbsp;
        {hasResult
          ? `${game.away_score} - ${game.home_score} | Winner: ${game.actual_winner}`
          : <span style={{ fontStyle: "italic", color: "#999" }}>Pending</span>}
      </p>
    </div>
  );
}
