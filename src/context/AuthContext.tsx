import React, { createContext, useReducer } from 'react'
import { authReducer } from './authReducer';
import { Vale } from '../interfaces/Vale';

//define information that will be stored
export interface AuthState{
    isLoggedIn:boolean,
    userName?:string,
    userID?:number,
    token?:string,
    zoneID?:number,
    ticket?: Vale,
    appUniqueID?:string
}
//Initial State

export const authInitialState:AuthState={
    isLoggedIn:false,
    userName:undefined,
    userID:undefined,
    token:undefined,
    zoneID:undefined,
    ticket:undefined,
    appUniqueID:undefined
}

//Usar la interface para decirle a react como luce y que expone el context
export interface AuthContextProps{
    authState:AuthState,
    signIn:()=>void,
    logOut: () => void;
    changeUserID:(userId:number)=>void,
    changeUserName:(userName:string)=>void,
    changeToken:(token:string)=>void,
    changeZoneID:(zoneId:number)=>void,
    ChangeTicket:(ticketToLoad:Vale)=>void,
    removeTicket: () => void,
    changeUniqueAppID:(uniqueAppID:string)=>void;
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
        dispatch({type:'changeToken',payload:token})   
    }
    const changeZoneID=(zoneId:number)=>{
        dispatch({type:'changeZoneId',payload:zoneId})   
    }
    const ChangeTicket=(ticketToLoad:Vale)=>{
        dispatch({type:'changeTicket',payload:ticketToLoad})   
    }
    const changeUniqueAppID=(UniqueAppID:string)=>{
        dispatch({type:'changeUniqueAppID',payload:UniqueAppID})   
    }
    const removeTicket=()=>{
        dispatch({type:'removeTicket'})   

    }


return(
    <AuthContext.Provider value={{
        authState,
        signIn,
        logOut,
        changeUserID,
        changeUserName,
        changeToken,
        changeZoneID,
        ChangeTicket,
        removeTicket,
        changeUniqueAppID
    }}>
        {children}
    </AuthContext.Provider>
)
}
