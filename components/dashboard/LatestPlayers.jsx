import Link from 'next/link'

export default function LatestPlayers({ players }) {
  return (
    <div className="card-ui">
      <h2>Últimos jogadores</h2>

      {players.length === 0 ? (
        <p
          style={{
            marginTop: 20,
            color: 'var(--text-muted)',
          }}
        >
          Ainda não existem jogadores registados.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 12,
            marginTop: 20,
          }}
        >
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/jogadores/${player.id}`}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 14,
              }}
            >
              <strong>{player.name}</strong>

              {player.nickname && (
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 14,
                    marginTop: 4,
                  }}
                >
                  {player.nickname}
                </div>
              )}

              {player.city && (
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  📍 {player.city}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
