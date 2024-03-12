import React, { useState } from 'react'
import { useEffect } from 'react';

const useDate = () => {

    const [date, setDate] = useState('')
    
    const getCurrentDate=()=>{
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        setDate (date + '/' + month + '/' + year)
    }
    useEffect(() => {
      getCurrentDate();
    }, [])
    

  return {
    date,
    getCurrentDate
  }
}

export default useDate