import React, {useEffect, useState} from 'react'
import { txDataResponse } from '@/types/types';

const ghRepo = 'https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/2023/tx_summary_2023-06-29.csv'

const useFetchTxData = () => {
    const [csvData, setCsvData] = useState('');
    const [txData, setTxData] = useState<txDataResponse[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(ghRepo);
          if (response.ok) {
            const data = await response.text();
            setCsvData(data);
          } else {
            console.error('Request failed with status', response.status);
          }
        } catch (error) {
          console.error('An error occurred', error);
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
        if (csvData) {
            const rows = csvData.split('\n');
            const headers = rows[0].split(',');
            const txData = rows.slice(1).map(row => {
                const values = row.split(',');
                const txData: txDataResponse = {
                    to: values[0],
                    ["Regular Tx"]: Number(values[1]),
                    ["Fees burned"]: Number(values[2]),
                    ["to_def"]: values[3],
                    ["Internal Tx"]: Number(values[4]),
                    ["Internal Event (excluding Tx)"]: Number(values[5]),
                    group: values[6],
                }
                return txData
            })
            setTxData(txData)
        }
    }, [csvData])



    return { txData }
}

export default useFetchTxData