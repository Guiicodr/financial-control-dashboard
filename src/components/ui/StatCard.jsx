import "../../styles/ui/StatCard.css";

function StatCard({
    title,
    value,
    icon,
    variant = "primary",
    prefix = "",
    suffix = "",
    subtitle = ""
}) {

    return (

        <div className={`stat-card ${variant}`}>

            <div className="stat-header">

                <span>{title}</span>

                <div className="stat-icon">
                    {icon}
                </div>

            </div>

            <h2>
                {prefix}{value}{suffix}
            </h2>

            <p className="stat-subtitle">
                {subtitle}
            </p>

        </div>

    );

}

export default StatCard;