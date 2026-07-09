import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import type { CheckIn, StatusFinal } from '../types'

export function statusToY(status: StatusFinal): number {
  return { SAFE: 0, CARE: 1, DANGER: 2 }[status]
}

export function yToLabel(y: number): string {
  return ['SAFE', 'CARE', 'DANGER'][y] ?? ''
}

const STATUS_COLOR: Record<StatusFinal, string> = {
  SAFE:   '#43A047',
  CARE:   '#F9A825',
  DANGER: '#E53935',
}

interface Props {
  history: CheckIn[]
}

export function EvolucaoChart({ history }: Props) {
  const chartData = [...history]
    .reverse()
    .map(c => ({
      data: c.data,
      y: statusToY(c.statusFinal),
      status: c.statusFinal,
    }))

  const latestStatus = history[0]?.statusFinal ?? 'SAFE'
  const lineColor = STATUS_COLOR[latestStatus]

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="#1e1e1e" vertical={false} />
        <XAxis
          dataKey="data"
          tick={{ fill: '#555', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 2]}
          reversed
          ticks={[0, 1, 2]}
          tickFormatter={yToLabel}
          tick={{ fill: '#555', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(value: number) => [yToLabel(value), 'Status']}
          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '11px' }}
          labelStyle={{ color: '#888' }}
          itemStyle={{ color: lineColor }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={lineColor}
          strokeWidth={2.5}
          dot={({ cx, cy, payload }) => (
            <circle
              key={`dot-${payload.data}`}
              cx={cx}
              cy={cy}
              r={4}
              fill={STATUS_COLOR[payload.status as StatusFinal]}
              stroke="none"
            />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
