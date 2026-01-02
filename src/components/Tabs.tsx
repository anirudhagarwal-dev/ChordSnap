type Props = {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: activeTab === tab ? 'var(--accent-purple)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : '2px solid transparent',
            fontSize: '14px',
            fontWeight: activeTab === tab ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}