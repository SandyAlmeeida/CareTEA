import { getCareteaProfile } from "../../utils/careteaSession.js";
import "./PerfilAvatar.css";

function PerfilAvatar({ size = "normal" }) {
  const profile = getCareteaProfile();

  const userName = profile?.userName || "Usuário";

  const initials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={`caretea-profile-avatar caretea-profile-avatar-${size}`}
      aria-hidden="true"
    >
      {initials || "U"}
    </span>
  );
}

export default PerfilAvatar;