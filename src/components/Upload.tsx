type Props = {
  onAnalyze: (file: File) => Promise<void> | void
}

export function Upload({ onAnalyze }: Props) {
  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <input
        type="file"
        accept="audio/*,.mp3,.wav"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await onAnalyze(file)
        }}
      />
    </div>
  )
}