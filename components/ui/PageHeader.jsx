export default function PageHeader({
  icon,
  title,
  description,
  actions
}) {
  return (
    <div className="page-header">

      <div>

        <h1>
          {icon} {title}
        </h1>

        <p>
          {description}
        </p>

      </div>

      {actions}

    </div>
  )
}
