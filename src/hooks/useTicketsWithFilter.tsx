import React, { useEffect, useState } from 'react'
import { Vale } from '../interfaces/vale';
import { connectToDatabase } from '../data/dbStructure';
import { dateFormatedDateFiltered } from '../data/dateFormated';
import { Alert } from 'react-native';

const db = connectToDatabase();

export const useTicketsWithFilter = () => { 
    const [ticketsIsloading, setTicketsIsloading] = useState(true)
    const [dateMin, setDateMinInt] = useState<Date>()
    const [dateMax, setDateMaxInt] = useState<Date>()
    const [textFilter, setTextFilterInt] = useState('')

    const [tickets,setTickets] = useState<Vale[]>(
        []
    )
    useEffect(() => {
      
        reloadItem()       
      
    }, [dateMax,dateMin,textFilter])

    const reloadItem=()=>{
                getTickets(dateFormatedDateFiltered(dateMin),
                                            dateFormatedDateFiltered(dateMax),
                                            textFilter)
    }
    
    let tempArray :Vale[]=[] ;

   const setDateMin=async(dateMinAux:Date|undefined)=>{
    if(dateMinAux){
            setDateMinInt(dateMinAux);
    }
    else{setDateMinInt(undefined)}
   }

   const setDateMax=async(dateMaxAux:Date|undefined)=>{
    if(dateMaxAux){
        setDateMaxInt(dateMaxAux)
    }
    else{
        setDateMaxInt(undefined)
    }
   }
   const setTextFilter=async(textToSearch:string)=>{
    setTextFilterInt(textToSearch);
   }

   const getTickets=async (fechaMin:String|undefined,fechaMax:String|undefined, folioFisico:String|undefined)=>{
    let finalSentence="SELECT * FROM Vales WHERE 1=1 AND estadoVale=1 "
    if (fechaMin){ finalSentence= finalSentence+ " AND fechaCreacion > date('"+fechaMin+"')"}
    if (fechaMax){ finalSentence= finalSentence+ " AND fechaCreacion < date('"+fechaMax+"')"}
    if (folioFisico){ finalSentence= finalSentence+ " AND (folioFisico like '%"+folioFisico+"%' OR placa like '%"+folioFisico+"%'  OR numeroTolva like '%"+folioFisico+"%')"}
    finalSentence= finalSentence + " ORDER BY vales.valeid DESC",
    console.log(finalSentence)
    setTicketsIsloading(true)

     try {
   
        await (await db).transaction((tx) => {
          tx.executeSql(finalSentence
          , []).then(
            ([tx,results]) => {
                console.log('RESULTS: ' +JSON.stringify(results))
                if (results.rows.length>0){
                    for (let i = 0; i <results.rows.length; i++) {
                        tempArray.push(results.rows.item(i) as Vale)
                    }
                    setTickets(tempArray);
                    setTicketsIsloading(false)
                    }
                else{setTickets([])}
                }
                
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
   }
   useEffect(() => {
    //const today = new Date();
    //getTickets('2024-01-01',dateFormatedDateFiltered(today),'')

   }, [])
   
    return {
        tickets,
        ticketsIsloading,
        getTickets,
        dateMin, 
        setDateMin,
        dateMax, 
        setDateMax,
        textFilter, 
        setTextFilter,
        reloadItem
    }
}
