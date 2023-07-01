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

import { Line, Bar, Scatter, Bubble, getElementAtEvent } from 'react-chartjs-2'
import useFetchTxData from '@/hooks/useFetchTxData'

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


const InternalTxsBar  = () => {
  const {txData} = useFetchTxData()
  const [chartData, setChartData] = useState<ChartData|null>(null)
  
  const groups: Record<string, number> = {};

  // prepare the data for a donut chart
  useEffect(() => {
    
    // make an object with grouped data
    
    setChartData(null)

    if (txData) {
      // loop through the txData
      txData.forEach((tx) => {
    
        const groupsToIgnore = ['System', 'governance', 'undefined']
        // if the group is in the ignore list, skip it
        if (groupsToIgnore.includes(tx.group)) {
          return
        }
    
        // if group doesn't exist, create it
        if (!groups[tx.group]) {
          groups[tx.group] = 0
        }
        // add the tx value to the group
        groups[tx.group] += Number(Number(tx["Internal Tx"]).toFixed())

        // remove the group if it's < 2
        if (groups[tx.group] < 20) {
          delete groups[tx.group]
        }
      })
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
  }, [txData])


  const chartOptions = {
    plugins: {
      legend: {
        position: 'left',
        align: 'center',
        label: Object.keys(groups)
        // labels: {
        //   generateLabels: (chart:any) => {
        //     const data = chart.data;
        //     if (data.labels.length && data.datasets.length) {
        //       return data.labels.map((label:string, index:number) => {
        //         const dataset = data.datasets[0];
        //         const value = dataset.data[index].toFixed(0);
        //         const backgroundColor = dataset.backgroundColor[index];
        //         const borderColor = dataset.borderColor[index];

        //         return {
        //           text: `${label}: ${value}`,
        //           fillStyle: backgroundColor,
        //           strokeStyle: borderColor,
        //           lineWidth: 1,
        //           hidden: false,
        //           index: index,
        //         };
        //       });
        //     }
        //     return [];
        //   },
        // },
        
      },
    },
    layout: {
      padding: {
        right: 10,
        top: 10,
      },
    },

  } as any;
  
  const chartRef = useRef();
  
  
  const handleClick = (e:any) => {
    const el = getElementAtEvent(chartRef.current!,e);
    console.log(el)
    }

  return (
    <div>
      <div className="py-6 px-12 rounded-xl border rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-5xl font-bold">Internal Transactions</h2>   
          <p className="text-sm text-gray-500">2023-06-29</p>
        </div>
        { chartData && 
        <div className="">
          <Bar 
            data={chartData} 
            options={chartOptions}
            className='h-[300px] w-[600px]'
            onClick={handleClick}
          /> 
        </div>
        }
      </div>
    </div>
  )
}

export default InternalTxsBar
