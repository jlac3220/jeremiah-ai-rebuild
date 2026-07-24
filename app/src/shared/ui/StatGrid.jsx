import { colors, radius } from "../theme";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "14px",
};

const statCardStyle = {
  background: "#f8fafc",
  borderRadius: radius.md,
  padding: "18px",
  border: `1px solid ${colors.cardBorder}`,
};

const valueStyle = {
  margin: 0,
  fontSize: "1.85rem",
  fontWeight: 900,
  color: colors.text,
};

const labelStyle = {
  margin: "8px 0 0",
  fontSize: "0.92rem",
  color: colors.textFaint,
  fontWeight: 700,
};

/** stats: [{ value, label }] */
export default function StatGrid({ stats = [], style }) {
  return (
    <div style={{ ...gridStyle, ...style }}>
      {stats.map((stat) => (
        <div key={stat.label} style={statCardStyle}>
          <p style={valueStyle}>{stat.value}</p>
          <p style={labelStyle}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
