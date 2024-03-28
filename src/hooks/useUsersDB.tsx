
import {useEffect, useState } from 'react'
import { ResultSet, Transaction } from 'react-native-sqlite-storage';
import { connectToDatabase } from '../data/dbStructure';
import { Usuario } from '../interfaces/usuarios';

const db = connectToDatabase();
export const useUsersDB = () => {
 const [users, setUsers] = useState<Usuario[]>(
     []
 )



    const getUsers=async ()=>{
      let tempArray :Usuario[]=[] ;

        try {
      
            (await db).transaction((tx) => {
              tx.executeSql("SELECT * FROM usuarios", []).then(
                ([tx,results]) => {
                  for (let i = 0; i <results.rows.length; i++) {
                    tempArray.push(results.rows.item(i) as Usuario)
                  }
                  setUsers(tempArray);
        
                }
              );
            });
          } catch (error) {
            console.error(error)
            throw Error("Failed to get data from database")
          }
    }
  
    const getUserByUserName=async ( userName:string)=>{
      let tempArray :Usuario[]=[] ;

      try {
    
          (await db).transaction((tx) => {
            tx.executeSql("SELECT * FROM usuarios WHERE usuario=? ", [
              userName
            ]).then(
              ([tx,results]) => {
                console.log(results.rows.raw())
                for (let i = 0; i <results.rows.length; i++) {
                  tempArray.push(results.rows.item(i) as Usuario)
                }
                setUsers(tempArray);
      
              }
            );
          });
        } catch (error) {
          console.error(error)
          throw Error("Failed to get data from database")
        }
  }

 useEffect(() => {
    getUsers();
 }, [])
 
  return {
      users,
      getUsers,
      getUserByUserName

      }
}
