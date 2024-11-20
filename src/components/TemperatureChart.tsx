import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { TemperatureData } from '../types/temperature';

interface Props {
  data: TemperatureData[];
}

const TemperatureChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const timestamps = data.map(item => new Date(item.timestamp).toLocaleTimeString());
    const temperatures = data.map(item => item.temperature);

    const option = {
      title: {
        text: 'Real-time Temperature Monitor',
        textStyle: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 24,
          fontWeight: 500,
          color: '#1d1d1f'
        },
        padding: [20, 0]
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: {
          color: '#1d1d1f'
        },
        formatter: (params: any) => {
          const temp = params[0].value;
          const time = params[0].axisValue;
          return `Time: ${time}<br/>Temperature: ${temp}°C`;
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timestamps,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#86868b'
          }
        },
        axisLabel: {
          color: '#86868b'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Temperature (°C)',
        nameTextStyle: {
          color: '#86868b'
        },
        axisLine: {
          lineStyle: {
            color: '#86868b'
          }
        },
        axisLabel: {
          color: '#86868b'
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f7'
          }
        }
      },
      series: [{
        name: 'Temperature',
        type: 'line',
        data: temperatures,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#2997ff'
        },
        lineStyle: {
          color: '#2997ff',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(41, 151, 255, 0.3)' },
            { offset: 1, color: 'rgba(41, 151, 255, 0.1)' }
          ])
        }
      }]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={chartRef} className="w-full h-[600px]" />
  );
};

export default TemperatureChart;