interface ShareableCardProps {
  userName: string;
  totalHours: number;
  totalPlays: number;
  topShow: {
    name: string;
    episodes: number;
  };
  rank: number;
  totalUsers: number;
}

export function ShareableCard({
  userName,
  totalHours,
  totalPlays,
  topShow,
  rank,
  totalUsers,
}: ShareableCardProps) {
  return (
    <div
      id="shareable-card"
      style={{
        width: "600px",
        height: "800px",
        background: "linear-gradient(to bottom right, #101010, #1a0a2e, #16213e)",
        padding: "60px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Quicksand, sans-serif",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "384px",
          height: "384px",
          background: "rgba(170, 92, 195, 0.1)",
          borderRadius: "9999px",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "384px",
          height: "384px",
          background: "rgba(168, 85, 247, 0.1)",
          borderRadius: "9999px",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            {userName}
          </h1>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 600,
              background: "linear-gradient(to right, #aa5cc3, #c084fc, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            2025 Wrapped
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Total Hours */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #aa5cc3, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "8px",
                lineHeight: "1",
              }}
            >
              {totalHours}
            </div>
            <div style={{ fontSize: "22px", color: "#d1d5db", marginTop: "12px" }}>
              hours watched
            </div>
          </div>

          {/* Top Show */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "28px 24px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "12px" }}>
              Top Show
            </div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "8px",
                lineHeight: "1.2",
              }}
            >
              {topShow.name}
            </div>
            <div style={{ fontSize: "20px", color: "#aa5cc3" }}>
              {topShow.episodes} episodes
            </div>
          </div>

          {/* Rank and Plays */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#aa5cc3",
                  marginBottom: "8px",
                  lineHeight: "1",
                }}
              >
                #{rank}
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "12px" }}>
                out of {totalUsers}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#aa5cc3",
                  marginBottom: "8px",
                  lineHeight: "1",
                }}
              >
                {totalPlays}
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "12px" }}>
                total plays
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
