export default function GameCard({ game }) {
    return (
      <div className="game-card">
        <h3>{game.Matchup}</h3>
        <p>🏆 Predicted Winner: <strong>{game.Predicted_Winner}</strong></p>
        <p>📊 Home: {game.Home_Prob} | Away: {game.Away_Prob}</p>
        <p>🚑 Home Injuries: {Array.isArray(game.Home_Injuries) ? game.Home_Injuries.join(', ') : game.Home_Injuries}</p>
        <p>🚑 Away Injuries: {Array.isArray(game.Away_Injuries) ? game.Away_Injuries.join(', ') : game.Away_Injuries}</p>
      </div>
    );
  }