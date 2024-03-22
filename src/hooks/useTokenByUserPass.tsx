import React, { useEffect, useState } from 'react'
import excavacionesDB from '../api/excavacionesDB'
interface dataResponse{
    token:string
}
export const useTokenByUserPass = () => {
  const [token, setToken] = useState<string>('')
  
  const getToken=async (userName:string, password:string)=>{
    let result:string='';
    const promise =   new Promise(
        async (resolve, reject) => {

            const encoded: string = Buffer.from(password, 'utf8').toString('base64');
                    const response = await excavacionesDB.post('/codyauth',{
                            client_id : 'client1',
                            client_secret : 'secret1',
                            username : userName,
                            password : encoded,
                            scope : 'basic',
                    })
                    const dataRes:dataResponse =response.data;
                    console.log(JSON.stringify(dataRes.token));
                    setToken(dataRes.token);
                    resolve(dataRes.token)
        }  
    )
        
    await promise.then((res)=>{
        result=res as string
        return result;
    })
    
    return result;

    }
    return {
        token,
        getToken
    }



}
