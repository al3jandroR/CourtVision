export default function Controls({ onPredict }) {
  const handleClick = () => {
    const today = new Date().toISOString().split('T')[0];
    onPredict(today);
  };

  return (
    <div className="controls" style={{ flexDirection: "column", alignItems: "center" }}>
      <button onClick={handleClick}>
        🔮 Predict Today’s Games
      </button>
    </div>
  );
}
