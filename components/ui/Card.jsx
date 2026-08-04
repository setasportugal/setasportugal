export default function Card({
  children,
  title,
  subtitle,
  actions,
  padding = 24,
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding,
        boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
        marginBottom: 24,
      }}
    >
      {(title || subtitle || actions) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#0f172a',
                }}
              >
                {title}
              </h3>
            )}

            {subtitle && (
              <p
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div>
              {actions}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  )
}
