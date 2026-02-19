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
  const formattedData = data.map((item) => ({
    time: new Date(item.dt * 1000).getHours(),
    temp: Math.round(item.temp),
  }));

  return (
    <div className="w-full h-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis
            dataKey="time"
            tick={{ fill: "#ffffff80", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              color: "white",
            }}
          />
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

export default HourlyTempChart;
