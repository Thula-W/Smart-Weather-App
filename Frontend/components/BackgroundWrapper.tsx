import React from "react";

interface BackgroundWrapperProps {
  condition: string;
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  condition,
  children,
}) => {
  const getBackgroundImage = (cond: string) => {
    switch (cond) {
      case "Clear":
        return "/backgrounds/clear.jpg";
      case "Clouds":
        return "/backgrounds/cloud.jpg";
      case "Rain":
      case "Drizzle":
        return "/backgrounds/rain.jpg";
      case "Snow":
        return "/backgrounds/snow.jpg";
      case "Thunderstorm":
        return "/backgrounds/thunder.jpg";
      case "Mist":
      case "Fog":
      case "Haze":
        return "/backgrounds/mist.jpg";
      default:
        return "/backgrounds/cloud.jpg";
    }
  };

  return (
    <div
      className="relative min-h-screen w-full transition-all duration-1000 bg-center bg-cover bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${getBackgroundImage(condition)})`,
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Optional subtle blur glow elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;