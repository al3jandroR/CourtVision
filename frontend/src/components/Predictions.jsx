import GameCard from './GameCard';

export default function Predictions({ predictions }) {
  if (!predictions) return null;

  if (predictions.message) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>{predictions.message}</p>;
  }

  return (
    <div className="predictions">
      {predictions.map((game, index) => (
        <GameCard key={index} game={game} />
      ))}
    </div>
  );
}
