import React, { useEffect, useState} from 'react'

type Props = {
  onClick: () => void
  selectedDate: Date|null
  maxDate: Date|null
}

const RightChevron = (props: Props) => {
  const [clickAble, setClickAble] = useState(false)

  useEffect(() => {
    if (props.selectedDate && props.maxDate) {
      if (props.selectedDate.getTime() < props.maxDate.getTime()) {
        setClickAble(true)
      } else {
        setClickAble(false)
      }
    }
  }, [props.selectedDate, props.maxDate])

  
  
  
  return (
    <div onClick={clickAble ? props.onClick : ()=>{}} className={`${clickAble ? 'cursor-pointer' : 'text-gray-100'} transition `}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  )
}

export default RightChevron