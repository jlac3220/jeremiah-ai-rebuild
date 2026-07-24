import { useState } from "react";
import PrimaryButton from "../../../shared/ui/PrimaryButton";
import { colors } from "../../../shared/theme";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div style={rowStyle}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        placeholder="Ask Jeremiah a doctrinal question..."
        style={textareaStyle}
      />
      <PrimaryButton onClick={handleSend} disabled={disabled || !value.trim()} style={{ background: "#0f172a", color: "#ffffff" }}>
        Send
      </PrimaryButton>
    </div>
  );
}

const rowStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-end",
};

const textareaStyle = {
  flex: 1,
  minHeight: "52px",
  maxHeight: "140px",
  borderRadius: "16px",
  border: `1px solid ${colors.cardBorder}`,
  padding: "14px",
  boxSizing: "border-box",
  resize: "vertical",
  outline: "none",
  fontSize: "0.98rem",
  lineHeight: 1.5,
  fontFamily: "inherit",
};
