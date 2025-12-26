import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartProps {
  option: echarts.EChartsOption;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ option, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = echarts.init(ref.current);
    instance.setOption(option);
    const handleResize = () => instance.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      instance.dispose();
    };
  }, [option]);

  return <div ref={ref} className={className} />;
};

export default Chart;
