export default function GameCard({ game }) {
  const isPending = !game.actual_winner;
  const isCorrect = game.actual_winner === game.Predicted_Winner;

  let cardStyle = "game-card";
  if (!isPending) {
    cardStyle += isCorrect ? " correct" : " incorrect";
  } else {
    cardStyle += " pending";
  }

  return (
    <div className={cardStyle}>
      <h3>{game.Matchup}</h3>
      <p>🏆 Predicted Winner: <strong>{game.Predicted_Winner}</strong></p>
      <p>📊 Home: {game.Home_Prob} | Away: {game.Away_Prob}</p>
      <p>🚑 Home Injuries: {Array.isArray(game.Home_Injuries) ? game.Home_Injuries.join(', ') : game.Home_Injuries}</p>
      <p>🚑 Away Injuries: {Array.isArray(game.Away_Injuries) ? game.Away_Injuries.join(', ') : game.Away_Injuries}</p>
      <p>
        🏁 Final Score:{" "}
        {isPending
          ? <em>Pending</em>
          : `${game.away_score} - ${game.home_score} → ${game.actual_winner}`}
      </p>
    </div>
  );
}
