export default function FormSection({
  title,
  description,
  children,
  columns = 1,
}) {
  return (
    <section
      style={{
        marginBottom: 32,
      }}
    >
      <div
        style={{
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              color: '#64748b',
              fontSize: '0.92rem',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            columns === 2 ? '1fr 1fr' :
            columns === 3 ? '1fr 1fr 1fr' :
            '1fr',
          gap: 20,
        }}
      >
        {children}
      </div>
    </section>
  )
}
