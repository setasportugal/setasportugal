export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
}) {
  const styles = {
    primary: {
      background: '#2563eb',
      color: '#fff',
      border: '1px solid #2563eb',
    },
    secondary: {
      background: '#fff',
      color: '#334155',
      border: '1px solid #cbd5e1',
    },
    danger: {
      background: '#dc2626',
      color: '#fff',
      border: '1px solid #dc2626',
    },
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: '10px 18px',
        borderRadius: 10,
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: '0.2s',
      }}
    >
      {children}
    </button>
  )
}
