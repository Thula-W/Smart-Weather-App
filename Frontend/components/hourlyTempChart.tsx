import { HourlyWeather } from "@/types";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface Props {
  data: HourlyWeather[];
}

const HourlyTempChart = ({ data }: Props) => {
  const formattedData = data.map((item) => {
    const date = new Date(item.dt * 1000);

    return {
      hour: date.getHours(), // minimal value for X-axis
      fullTime: date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      }), // formatted for tooltip
      temp: Math.round(item.temp),
    };
  });

  return (
    <div className="w-full h-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis
            dataKey="hour"
            tick={{ fill: "#ffffff80", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="temp"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { fullTime, temp } = payload[0].payload;

    return (
      <div
        className="px-4 py-2 rounded-xl text-white text-sm shadow-lg"
        style={{
          background: "rgba(37, 167, 223, 0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p className="font-semibold">{fullTime}</p>
        <p>{temp}°C</p>
      </div>
    );
  }

  return null;
};

export default HourlyTempChart;
