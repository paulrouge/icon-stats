import React, {useEffect, useState, useRef} from 'react'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)
import DateSetter from '../ui/DateSetter';
import { Line, Bar, Scatter, Bubble, getElementAtEvent } from 'react-chartjs-2'
import { formatDateForGHRepo, formatWeeklyDatesForGHRepo, formatMonthlyDatesForGHRepo } from '@/utils/utils';
import useTrends from '@/hooks/useTrends';

type ChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderColor: string[],
    borderWidth: number,
  }[]
}

// array of colors for the chart
const bgColors:string[] = ['#54478c', '#2c699a', '#048ba8', '#0db39e', '#16db93', '#83e377', '#b9e769', '#efea5a', '#f1c453', '#f29e4c', '#f4845f', '#f76f8e', '#e15b97', '#c9406a', '#a9225c', '#831843', '#4b202e', '#2a0c3a', '#050c3a', '#0c2e3d', '#183d3f', '#1e4d2b', '#1e4d2b', '#345e3f', '#4b6e51', '#627e63', '#7a8e75', '#93a085', '#aeb096', '#c8c8a9', '#e3e3bd', '#ffffd4']


const TrendLines  = () => {
  const { trends, fetchTrends} = useTrends()
  const [chartData, setChartData] = useState<ChartData|null>(null)
  const [selectedDate, setSelectedDate] = useState<Date|null>(null)
  const [maxDate, setMaxDate] = useState<Date|null>(null)
  const [windowWidth, setWindowWidth] = useState<number>(0)

  // get the window width
  useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  // set the initial date to yesterday, the max date should also be yesterday and stay that way
  useEffect(() => {
    const yesterday = new Date(Date.now() - 864e5)
    setSelectedDate(yesterday)
    setMaxDate(yesterday)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchTrends(selectedDate)
    }
  }, [fetchTrends, selectedDate])

  

  // prepare the data for the chart
  useEffect(() => {
    setChartData(null)
    const groups: Record<string, number> = {};
    if (trends) {
      // loop through the txData
      // trends.forEach((date) => {
      //   // do stuff if needed
      // })
    }

    // create the chart data
    const chartData:ChartData = {
      labels: Object.keys(groups),
      datasets: [
        {
          label: 'Internal Txs',
          data: Object.values(groups),
          backgroundColor: bgColors,
          borderColor: [
            'rgba(255, 255, 255, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    }

    setChartData(chartData)
  }, [])

  const getPos = () => {
    if (windowWidth < 768) {
      return 'bottom'
    } else {
      return 'left'
    }
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: getPos(),
        align: 'center',
        maintainAspectRatio: false,
        responsive: true,
        display: false,
        labels: {
          generateLabels: (chart:any) => {
            if (windowWidth < 768) {
              return []
            }
            const data = chart.data;

            if (data.labels.length && data.datasets.length) {
              // console.log('amount of entries', data.labels.length, data)
              
              return data.labels.map((label:string, index:number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[index].toFixed(0);
                const backgroundColor = dataset.backgroundColor[index];
                const borderColor = dataset.borderColor[index];

                return {
                  text: `${label}: ${value}`,
                  fillStyle: backgroundColor,
                  strokeStyle: borderColor,
                  lineWidth: 1,
                  hidden: false,
                  index: index,
                };
              });
            }
            return [];
          },
        },        
      },
    },
  } as any;
  
  return (
    <div>
      <div className="py-6 px-12 rounded-xl border rounded-xl bg-white shadow-lg">
        <div className="flex items-center">
          <h2 className="md:text-5xl text-2xl font-bold">Internal Transactions</h2>   
        </div>
        <div className="flex items-center justify-between">

          <DateSetter date={selectedDate} setDate={setSelectedDate} maxDate={maxDate}/>
        </div>
        { chartData && 
        <div className="h-[400px] w-[800px] flex items-center justify-center">
          <Bar 
            data={chartData} 
            options={chartOptions}
            className='w-full h-full'
          /> 
        </div>
        }
      </div>
    </div>
  )
}

export default TrendLines
