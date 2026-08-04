export default function Textarea({
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

      <textarea {...props} />

      {help && (
        <small>{help}</small>
      )}

    </div>
  )
}
