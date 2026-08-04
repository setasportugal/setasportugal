export default function Input({
  label,
  required = false,
  type = 'text',
  placeholder = '',
  value,
  onChange,
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

      <input
        type={type}
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
          transition: '0.2s',
          background: disabled ? '#f8fafc' : '#ffffff',
          boxSizing: 'border-box',
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
