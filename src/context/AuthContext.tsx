import React, { createContext, useReducer } from 'react'
import { authReducer } from './authReducer';

//define information that will be stored
export interface AuthState{
    isLoggedIn:boolean,
    userName?:string,
    userID?:number,
    token?:string,
    zoneID?:number,
}
//Initial State

export const authInitialState:AuthState={
    isLoggedIn:false,
    userName:undefined,
    userID:undefined,
    token:undefined,
    zoneID:undefined
}

//Usar la interface para decirle a react como luce y que expone el context
export interface AuthContextProps{
    authState:AuthState,
    signIn:()=>void,
    logOut: () => void;
    changeUserID:(userId:number)=>void,
    changeUserName:(userName:string)=>void,
    changeToken:(userName:string)=>void,
    changeZoneID:(zoneId:number)=>void,

}

//Crear el contexto
export const AuthContext= createContext({} as AuthContextProps);


export const AuthProvider = ({children}:any) => {

    const [authState, dispatch] = useReducer(authReducer, authInitialState)
    const signIn =()=>{
        dispatch({type:'signIn'})   

    }
    const logOut =()=>{
        dispatch({type:'logOut'})   
    }
    const changeUserID =(userID:number)=>{
        dispatch({type:'changeUserID',payload:userID})   
    }
    const changeUserName =(userName:string)=>{
        dispatch({type:'changeUserName',payload:userName})   
    }
    const changeToken =(token:string)=>{
        dispatch({type:'changeUserName',payload:token})   
    }
    const changeZoneID=(zoneId:number)=>{
        dispatch({type:'changeZoneId',payload:zoneId})   

    }


return(
    <AuthContext.Provider value={{
        authState,
        signIn,
        logOut,
        changeUserID,
        changeUserName,
        changeToken,
        changeZoneID
    }}>
        {children}
    </AuthContext.Provider>
)
}