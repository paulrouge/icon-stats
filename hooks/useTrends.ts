import { useEffect, useState} from 'react'
import { trendsResponse } from '@/types/types';
import { formatDateForGHRepo } from '@/utils/utils';


const useTrends = () => {
  const [csvData, setCsvData] = useState('');
  const [trends, setTrends] = useState<trendsResponse[]|null>(null);

  useEffect(() => {
    if (csvData) {
      const rows = csvData.split('\n');
      // const headers = rows[0].split(',');
      const trendData = rows.slice(1).map(row => {
        const values = row.split(',');
        const trendData: trendsResponse = {
          date: values[1],
          ["Regular Tx"]: Number(values[2]),
          ["Fees burned"]: Number(values[3]),
          ["Internal Tx"]: Number(values[4]),
          ["Internal Event (excluding Tx)"]: Number(values[5]),
          ["Regular & Interal Tx	"]: Number(values[6]),
          ["Regular & Interal Tx (MA7)"]: Number(values[7]),
          ["Regular & Interal Tx (MA30)"]: Number(values[8]),
          ["Fees burned (MA7)"]: Number(values[9]),
          ["Fees burned (MA30)"]: Number(values[10]),
        }
        return trendData
      })
 
      setTrends(trendData)
    }
  }, [csvData])

  const fetchTrends= async (_date:Date) => {
    // https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/2023/tx_trend_2023-08-15.csv
    const date = formatDateForGHRepo(_date).replaceAll('_', '-')
    const year = date.split('-')[0]
    let url = `https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/${year}/tx_trend_${date}.csv`
    
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.text();
        setCsvData(data);
      } else {
        console.error('Request failed with status', response.status);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  }

  return { 
    trends,
    fetchTrends,
  }
}

export default useTrends