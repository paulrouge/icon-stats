import { useState, useEffect } from 'react'

const treshold = 500

const WidthWarningBar = () => {
    const [width, setWidth] = useState<number|null>(null)

    useEffect(() => {
      setWidth(window.innerWidth)
      // console.log true if the width is smaller than the treshold

    }, [])

    // add eventlistner to update the width state
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    return (

        <>
        {/* if the width is smaller than the treshold, show the warning bar */}
        {width && width < treshold &&
        <div className={`fixed top-20 z-50 bg-yellow-500 p-2 rounded text-center text-white flex flex-col items-center justify-center text-xs`}>
        <p className={`text-center`}>This app is not optimized for small screens. Please use a larger device or try your phone in horizontal mode, and refresh the page.</p>
        </div>
        }
        </>
  
    )
}

export default WidthWarningBar