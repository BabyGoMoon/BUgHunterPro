"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ActivityData {
  date: string
  scans: number
  vulns: number
  points: number
}

interface ActivityChartProps {
  data: ActivityData[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 0, 0.1)" />
          <XAxis
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(0, 255, 0, 0.2)",
              borderRadius: "8px",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#00FF00" }}
          />
          <Bar dataKey="points" fill="#00FF00" radius={[4, 4, 0, 0]} />
          <Bar dataKey="vulns" fill="#18FF6D" radius={[4, 4, 0, 0]} />
          <Bar dataKey="scans" fill="#009862" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
