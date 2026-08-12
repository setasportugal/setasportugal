'use client'

import { useEffect, useState } from 'react'

const emptyMatch = {
  participant1Id: '',
  participant2Id: '',
  player1Score: '0',
  player2Score: '0',
  status: 'scheduled',
}

export default function MatchForm({
  mode,
  participants,
  initialMatch,
  saving,
  onSubmit,
  submitLabel,
}) {
  const [form, setForm] = useState(emptyMatch)

  useEffect(() => {
    setForm({
      ...emptyMatch,
      ...initialMatch,
      player1Score: String(initialMatch?.player1Score ?? 0),
      player2Score: String(initialMatch?.player2Score ?? 0),
    })
  }, [initialMatch])

  const participantLabel = mode === 'equipas' ? 'Equipa' : 'Jogador'
  const canSave = participants.length >= 2

  function updateField(field, value) {
    setForm(current => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()

    if (!form.participant1Id || !form.participant2Id) {
      alert('Seleciona ambos os participantes.')
      return
    }

    if (form.participant1Id === form.participant2Id) {
      alert('Os participantes tÃªm de ser diferentes.')
      return
    }

    const player1Score = Number(form.player1Score)
    const player2Score = Number(form.player2Score)

    if (!Number.isInteger(player1Score) || !Number.isInteger(player2Score) || player1Score < 0 || player2Score < 0) {
      alert('O resultado tem de usar nÃºmeros inteiros iguais ou superiores a zero.')
      return
    }

    onSubmit({
      ...form,
      player1Score,
      player2Score,
    })
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 18, marginTop: 24 }}>
      <div>
        <label>{participantLabel} 1</label>
        <select
          className="search"
          value={form.participant1Id}
          onChange={event => updateField('participant1Id', event.target.value)}
          disabled={!canSave || saving}
        >
          <option value="">Seleciona {participantLabel.toLowerCase()}</option>
          {participants.map(participant => (
            <option key={participant.id} value={participant.id}>
              {participant.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>{participantLabel} 2</label>
        <select
          className="search"
          value={form.participant2Id}
          onChange={event => updateField('participant2Id', event.target.value)}
          disabled={!canSave || saving}
        >
          <option value="">Seleciona {participantLabel.toLowerCase()}</option>
          {participants.map(participant => (
            <option key={participant.id} value={participant.id}>
              {participant.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Estado</label>
        <select
          className="search"
          value={form.status}
          onChange={event => updateField('status', event.target.value)}
          disabled={saving}
        >
          <option value="scheduled">Agendado</option>
          <option value="completed">ConcluÃ­do</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Resultado {participantLabel} 1</label>
          <input
            className="search"
            type="number"
            min="0"
            value={form.player1Score}
            onChange={event => updateField('player1Score', event.target.value)}
            disabled={form.status !== 'completed' || saving}
          />
        </div>

        <div>
          <label>Resultado {participantLabel} 2</label>
          <input
            className="search"
            type="number"
            min="0"
            value={form.player2Score}
            onChange={event => updateField('player2Score', event.target.value)}
            disabled={form.status !== 'completed' || saving}
          />
        </div>
      </div>

      <button className="btn" type="submit" disabled={!canSave || saving}>
        {saving ? 'A guardar...' : submitLabel}
      </button>
    </form>
  )
}

