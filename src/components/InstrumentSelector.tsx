import type { Instrument } from '../types'

type Props = {
  value: Instrument
  onChange: (inst: Instrument) => void
}

export function InstrumentSelector({ value, onChange }: Props) {
  return (
    <div style={{ margin: '12px 0' }}>
      <label style={{ marginRight: 8 }}>Instrument:</label>
      <select value={value} onChange={(e) => onChange(e.target.value as Instrument)}>
        <option value="guitar">Guitar</option>
        <option value="piano">Piano</option>
        <option value="ukulele">Ukulele</option>
      </select>
    </div>
  )
}