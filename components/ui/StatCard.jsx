import Link from 'next/link'

export default function StatCard({
  title,
  value,
  icon,
  href,
  subtitle
}) {
  const content = (
    <>
      <div className="stat-card-top">
        <span className="stat-card-icon">
          {icon}
        </span>

        <span className="stat-card-value">
          {value}
        </span>
      </div>

      <h3>{title}</h3>

      {subtitle && (
        <p>{subtitle}</p>
      )}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="stat-card"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="stat-card">
      {content}
    </div>
  )
}
