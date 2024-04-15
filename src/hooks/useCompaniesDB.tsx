
import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Empresa } from '../interfaces/empresa';

const db = connectToDatabase();

export const useCompaniesDB = () => {
 const [companies, setCompanies] = useState<Empresa[]>(
     []
 )

const getCompanies=async ()=>{
  let tempArray :Empresa[]=[] ;

     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM empresas where activoEmpresa =1 and estadoEmpresa=1 OR empresaID=1", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Empresa)
              }
              setCompanies(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

 useEffect(() => {
  //getCompanies();
 }, [])
 
  return {
      companies,
      getCompanies
  }
}
