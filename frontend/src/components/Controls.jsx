export default function Controls({ onPredict }) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        margin: "2rem auto",
        flexWrap: "wrap"
      }}>
        <button onClick={onPredict} style={{
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#2563EB",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}>
          🔮 Get Today's Predictions
        </button>
  
        {/* Future: add date picker, filter dropdown here */}
      </div>
    );
  }
  