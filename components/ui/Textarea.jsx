export default function Textarea({
  label,
  required = false,
  placeholder = '',
  value,
  onChange,
  rows = 6,
  help,
  disabled = false,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 20,
      }}
    >
      <label
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#334155',
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: '#dc2626',
              marginLeft: 4,
            }}
          >
            *
          </span>
        )}
      </label>

      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid #cbd5e1',
          fontSize: '0.95rem',
          outline: 'none',
          resize: 'vertical',
          background: disabled ? '#f8fafc' : '#ffffff',
          boxSizing: 'border-box',
          lineHeight: 1.6,
          fontFamily: 'inherit',
        }}
      />

      {help && (
        <small
          style={{
            color: '#64748b',
            fontSize: '0.8rem',
          }}
        >
          {help}
        </small>
      )}
    </div>
  )
}
