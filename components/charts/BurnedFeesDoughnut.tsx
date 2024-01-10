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

import useFetchTxData from '@/hooks/useBurnedFees'
import DateSetter from '../ui/DateSetter';
import { formatDateForGHRepo, formatWeeklyDatesForGHRepo, formatMonthlyDatesForGHRepo } from '@/utils/utils';
import { COLORS } from '@/utils/constants';

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

export type period = 'daily' | 'weekly' | 'monthly'

const BurnedFeesDonut = () => {
  const [period, setPeriod] = useState<period>('weekly')
  const {txDataBurnedFees, fetchTxs} = useFetchTxData()
  const [chartData, setChartData] = useState<ChartData|null>(null)
  const [selectedDate, setSelectedDate] = useState<Date|null>(null)
  const [maxDate, setMaxDate] = useState<Date|null>(null)
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const chartRef = useRef();
 

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
      fetchTxs(period, selectedDate)
    }
  }, [fetchTxs, selectedDate, period])



  // prepare the data for a donut chart
  useEffect(() => {
    // make an object with grouped data
    const groups: Record<string, number> = {};
    
    if (txDataBurnedFees) {
      // loop through the txData
      txDataBurnedFees.forEach((tx) => {
        // shorten long group names
        if (tx.group === "Code Metal Rewards Distribution") {
          tx.group = "Code Metal"
        }

        if (tx.group === undefined) {
          return
        }

        // if group doesn't exist, create it
        if (!groups[tx.group]) {
          groups[tx.group] = 0
        }
        // add the tx value to the group
        groups[tx.group] += Number(Number(tx["Fees burned"]).toFixed(2))

        // remove the group if it's < 2
        if (groups[tx.group] < 2) {
          delete groups[tx.group]
        }
      })
    }

    // create the chart data
    const chartData:ChartData = {
      labels: Object.keys(groups),
      datasets: [
        {
          label: 'Burned Fees',
          data: Object.values(groups),
          backgroundColor: COLORS,
          borderColor: [
            'rgba(255, 255, 255, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    }

    setChartData(chartData)
  }, [txDataBurnedFees])

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
        position: 'left',
        align: 'center',
        labels: 
        {
          generateLabels: (chart:any) => {
            const data = chart.data;
        
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label:string, index:number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[index].toFixed(2);
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
    <div className='w-full lg:w-2/3'>
      <div className="md:py-6 md:px-12 p-2 rounded-xl border rounded-xl bg-white shadow-lg">
        <div className="flex items-center">
          <h2 className="lg:text-5xl text-2xl font-bold">Burned Fees</h2>  
        </div>
        <div className="flex items-center justify-between flex-col md:flex-row text-xs md:text-base gap-4 md:gap-0">
          <div className=''>
            <input type="radio" id="daily_burned" name="period_burned" value="daily" checked={period === "daily"} onChange={() => setPeriod("daily")} />
            <label htmlFor="daily" className="ml-2 mr-8">Daily</label>
            <input type="radio" id="weekly__burned" name="period_burned" value="weekly" checked={period === "weekly"} onChange={() => setPeriod("weekly")} />
            <label htmlFor="weekly" className="ml-2 mr-8">Weekly</label>
            <input type="radio" id="monthly__burned" name="period_burned" value="monthly" checked={period === "monthly"} onChange={() => setPeriod("monthly")} />
            <label htmlFor="monthly" className="ml-2 mr-8">Monthly</label>
          </div>
          <div className="text-xs lg:text-base">
            <DateSetter date={selectedDate} setDate={setSelectedDate} maxDate={maxDate}/>
          </div>
        </div>
        <div className='text-sm text-gray-500 my-4'>
        { selectedDate && period === "daily" && <p>{formatDateForGHRepo(selectedDate)}</p>}
        { selectedDate && period === "weekly" && <p>{formatWeeklyDatesForGHRepo(selectedDate).replaceAll("_", " ")}</p>}
        { selectedDate && period === "monthly" && <p>{formatMonthlyDatesForGHRepo(selectedDate).replaceAll("_", " ")}</p>}
        </div>
        { chartData && 
          <div className="relative w-full h-full">
            <Doughnut 
              data={chartData} 
              options={chartOptions}
              className='h-full w-full'
              ref={chartRef}
              // onClick={onClick}
            /> 
          </div>
        }
      </div>
    </div>
  )
}

export default BurnedFeesDonut