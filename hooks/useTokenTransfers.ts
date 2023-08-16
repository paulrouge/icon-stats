import { useEffect, useState} from 'react'
import { tokenDataResponse } from '@/types/types';
import {  formatDateForGHRepo} from '@/utils/utils';

const useTokenTransfers = () => {
  const [csvData, setCsvData] = useState('');
  const [tokenTransferData, setTokenTransferData] = useState<tokenDataResponse[]>([]);

  useEffect(() => {
    if (csvData) {
      const rows = csvData.split('\n');
      // const headers = rows[0].split(',');
      const tokenData = rows.slice(1).map(row => {
          const values = row.split(',');
          const tokenData: tokenDataResponse = {
            ["IRC Token"]: values[0],
            holders: parseInt(values[1]),
            liquidity: parseInt(values[2]),
            amount: parseInt(values[3]),
            ["No. of Transactions"]: parseInt(values[4]),
            ["Price in USD"]: parseInt(values[5]),
            ["Value Transferred in USD"]: parseInt(values[6]),
          }
          return tokenData
      })

      setTokenTransferData(tokenData)
    }
  }, [csvData])

  const fetchTxs= async (_date:Date) => {
    const formattedDate = formatDateForGHRepo(_date).replaceAll('-', '_')
    let url = `https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/10_token_transfer/results/${formattedDate}/IRC_token_transfer_${formattedDate}.csv`

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
    tokenTransferData,
    fetchTxs,
  }
}

export default useTokenTransfers