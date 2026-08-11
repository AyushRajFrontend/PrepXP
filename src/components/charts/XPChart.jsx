import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

/**
 * XPChart — XP earned per session bar chart.
 *
 * The last bar (most recent session / "today") is
 * highlighted with a brighter violet so users can
 * instantly see today's contribution.
 *
 * Props:
 *   data  — [{ [xKey]: string, xp: number }]
 *   xKey  — x-axis key ('day' | 'week' | 'month')
 */

const TICK_STYLE = {
  fill:       '#475569',
  fontSize:   11,
  fontFamily: 'Inter, system-ui, sans-serif',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background:   'rgba(19, 25, 41, 0.96)',
      border:       '1px solid rgba(255, 255, 255, 0.10)',
      borderRadius: 10,
      padding:      '8px 13px',
      minWidth:     80,
    }}>
      <p style={{ color: '#64748B', fontSize: 11, marginBottom: 5,
                  fontFamily: 'Inter, system-ui, sans-serif' }}>
        {label}
      </p>
      <p style={{
        color:      '#C084FC',
        fontSize:   14,
        fontWeight: 700,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        lineHeight: 1,
      }}>
        +{payload[0]?.value}
        <span style={{ fontSize: 11, fontWeight: 400, color: '#64748B' }}>
          {' '}XP
        </span>
      </p>
    </div>
  )
}

export default function XPChart({ data, xKey = 'day' }) {
  const lastIdx = data.length - 1

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart
        data={data}
        margin={{ top: 6, right: 4, bottom: 0, left: -28 }}
        barCategoryGap="30%"
      >
        <XAxis
          dataKey={xKey}
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          width={28}
          allowDecimals={false}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(192,132,252,0.05)', radius: 4 }}
        />

        {/* Single Bar — each cell coloured individually */}
        <Bar dataKey="xp" radius={[5, 5, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === lastIdx ? '#C084FC' : '#7C3AED'}
              fillOpacity={i === lastIdx ? 0.90 : 0.55}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
