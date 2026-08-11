import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

/**
 * ActivityChart — Study activity area chart.
 *
 * Shows lectures completed per day / week / month as a
 * gradient-filled area chart styled to match the dark design system.
 *
 * Uses inline styles for all Recharts props since SVG/Recharts
 * elements don't respond to Tailwind utility classes.
 *
 * Props:
 *   data  — [{ [xKey]: string, lectures: number }]
 *   xKey  — which data key to use as the X axis ('day' | 'week' | 'month')
 */

/* ── Inline styles matching the design system ── */
const TICK_STYLE = {
  fill:       '#475569',   /* --color-dim */
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
      minWidth:     90,
    }}>
      <p style={{ color: '#64748B', fontSize: 11, marginBottom: 5,
                  fontFamily: 'Inter, system-ui, sans-serif' }}>
        {label}
      </p>
      <p style={{
        color:      '#7C3AED',
        fontSize:   14,
        fontWeight: 700,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        lineHeight: 1,
      }}>
        {payload[0]?.value}
        <span style={{ fontSize: 11, fontWeight: 400, color: '#64748B' }}>
          {' '}lectures
        </span>
      </p>
    </div>
  )
}

export default function ActivityChart({ data, xKey = 'day' }) {
  return (
    <ResponsiveContainer width="100%" height={170}>
      <AreaChart
        data={data}
        margin={{ top: 6, right: 4, bottom: 0, left: -28 }}
      >
        <defs>
          <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"   stopColor="#7C3AED" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />

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
          cursor={{ stroke: 'rgba(124,58,237,0.18)', strokeWidth: 1 }}
        />

        <Area
          type="monotone"
          dataKey="lectures"
          stroke="#7C3AED"
          strokeWidth={2}
          fill="url(#actGrad)"
          dot={{ fill: '#7C3AED', strokeWidth: 0, r: 3 }}
          activeDot={{
            fill:        '#C084FC',
            r:           5,
            strokeWidth: 2,
            stroke:      '#0D1526',
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
