export default function Input({
  label,
  required = false,
  help,
  ...props
}) {
  return (
    <div className="field">

      <label>
        {label}

        {required && (
          <span style={{ color: '#dc2626' }}>
            {' '}*
          </span>
        )}

      </label>

      <input {...props} />

      {help && (
        <small>{help}</small>
      )}

    </div>
  )
}
