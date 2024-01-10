import React from 'react'
import LeftChevron from './LeftChevron'
import RightChevron from './RightChevron'

type Props = {
    // a date object
    date: Date|null
    // set useState
    setDate: React.Dispatch<React.SetStateAction<Date|null>>
    maxDate: Date|null
}

const DateSetter = (props: Props) => {
    // React.useEffect(() => {
    //     console.log(props.date)
    // }, [props.date])

    const minusOneDay = () => {
        const newDate = new Date(props.date!.getTime() - 864e5)
        props.setDate(newDate)
    }

    const plusOneDay = () => {
        // new date is the current date + 1 day
        const newDate = new Date(props.date!.getTime() + 864e5)
        props.setDate(newDate)
    }
  
    return (
    <div className='flex gap-2 items-center'>
        <LeftChevron onClick={minusOneDay}/>
        {
        props.date && 
            <span>{props.date!.toISOString().split('T')[0]}</span>
        }
        <RightChevron onClick={plusOneDay} selectedDate={props.date} maxDate={props.maxDate}/>
    </div>
  )
}

export default DateSetter