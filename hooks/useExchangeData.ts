import { useEffect, useState} from 'react'
import { exchangeDataResponse } from '@/types/types';
import { formatDateForGHRepo } from '@/utils/utils';

/**
 * Just using the total balance for now
 * but there is more datapoints available in hte exchangeData object
 */

const useExchangeData = () => {
  const [csvData, setCsvData] = useState('');
  const [exchangeData, setExchangeData] = useState<exchangeDataResponse[]|null>(null);

  useEffect(() => {
    if (csvData) {
      const rows = csvData.split('\n');
      // const headers = rows[0].split(',');
      const _exchangeData = rows.slice(1).map(row => {
        const values = row.split(',');
        const _exchangeData: exchangeDataResponse = {
            address: values[0],
            estimatedICX: Number(values[1]),
            stake: Number(values[2]),
            totalDelegated: Number(values[3]),
            balance: Number(values[4]),
            unstake: Number(values[5]),
            unstakeBlockHeight: Number(values[6]),
            remainingBlocks: Number(values[7]),
            totalBonded: Number(values[8]),
            total: Number(values[9]),
            names: values[10], 
        }
        return _exchangeData
      })

        // testing, print all names
        // const names = _exchangeData.map(exchange => exchange.names)
        // console.log(names)


        setExchangeData(_exchangeData)
    }
  }, [csvData])

  const fetchExchangeData = async (_date:Date) => {
    // https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/06_wallet_ranking/results/2023_05_03/exchange_wallet_balance_2023_05_03.csv
    const date = formatDateForGHRepo(_date).replaceAll('-', '_')
    let url = `https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/06_wallet_ranking/results/${date}/exchange_wallet_balance_${date}.csv`
    
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
    exchangeData,
    fetchExchangeData,
  }
}

export default useExchangeData