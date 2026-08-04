export default function PageHeader({
  title,
  description,
  icon,
  actions,
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 24,
        marginBottom: 32,
        paddingBottom: 20,
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          {icon && (
            <span
              style={{
                fontSize: '2rem',
                lineHeight: 1,
              }}
            >
              {icon}
            </span>
          )}

          <h1
            style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {title}
          </h1>
        </div>

        {description && (
          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: 1.6,
              maxWidth: 700,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </div>
      )}
    </div>
  )
}
