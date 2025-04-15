import { useState } from 'react';

export default function Controls({ onPredict }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const handleChange = (e) => setSelectedDate(e.target.value);
  const handleClick = () => onPredict(selectedDate);

  return (
    <div className="controls" style={{ flexDirection: "column", alignItems: "center" }}>
      <input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        style={{
          padding: "6px 10px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "12px"
        }}
      />
      <button onClick={handleClick}>
        🔮 Predict Games
      </button>
    </div>
  );
}
