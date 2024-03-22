import { Usuario } from '../interfaces/usuarios';
import { connectToDatabase } from './dbStructure';
import globalSettings from '../globalSettings';
import excavacionesDB from '../api/excavacionesDB';


global.Buffer = require('buffer').Buffer;
const db = connectToDatabase();

export interface loginResult{
    authorized:boolean,
    path:string,
    userID:string,
    zoneID:string,
}

interface dataResponse{
    token:string
}

export const getUserLogin = async (userName:string,pass:string) => {
    var loginResult:loginResult=
        {
            authorized:false,
            path:'',
            userID:'',
            zoneID:''
        }
    
    const promise =   new Promise<Usuario[]>(
        async (resolve, reject) => {
        (await db).transaction(
            async(tx)=>{
                var Usuarios:Usuario[]=[];
                            const [response,results] = await tx.executeSql("SELECT * FROM usuarios where usuario=?", [userName]);
                            if (results.rows.length >0){
                               for (let i = 0; i <results.rows.length; i++) {
                                Usuarios.push(results.rows.item(i) as Usuario)
                              }
                              resolve(Usuarios);   
                            }
                            else {resolve(Usuarios)}
        });
    });

    await promise.then((res)=>{
        if (res.length==0 )
        {
            return loginResult;
        }
        else{
            //1. pass equal to default
            if ((Buffer.from(pass, 'utf8').toString('base64')==globalSettings.passDefaultCody)&&(res[0].contrasena==globalSettings.passDefault)){
                loginResult={
                                authorized:true,
                                path:'RefreshDataFromDatabase',
                                userID:res[0].usuarioID.toString(),
                                zoneID:res[0].bancoID.toString(),
                            }
                return loginResult;
            }    
            //2. pass not equal to default      
            else if (res[0].contrasena===Buffer.from(pass, 'utf8').toString('base64')){
                loginResult={
                                authorized:true,
                                path:'RefreshDataFromDatabase',
                                userID:res[0].usuarioID.toString(),
                                zoneID:res[0].bancoID.toString(),

                            }
                return loginResult;
            }
            else{
            //3. not found
                return loginResult;   
            }        
        } 

    })
    return loginResult;
}


export const requestToken =async (userName:string, password:string)=>{
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
    return dataRes;

  }
