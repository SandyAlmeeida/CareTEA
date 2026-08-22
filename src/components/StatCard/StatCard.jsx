import "./StatCard.css";

function StatCard({
  icon,
  value,
  label,
  description,
  variant = "purple",
}) {
  return (
    <article className={`app-stat-card app-stat-card-${variant}`}>
      <div className="app-stat-card-icon">
        {icon}
      </div>

      <div className="app-stat-card-content">
        <strong className="app-stat-card-value">
          {value}
        </strong>

        <span className="app-stat-card-label">
          {label}
        </span>

        {description && (
          <small className="app-stat-card-description">
            {description}
          </small>
        )}
      </div>
    </article>
  );
}

export default StatCard;