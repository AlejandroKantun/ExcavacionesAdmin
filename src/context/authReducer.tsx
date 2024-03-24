import { Vale } from '../interfaces/vale';
import { AuthState } from './AuthContext';
type AuthAction=
    |{type:'signIn'}
    |{type:'logOut'}
    |{type:'changeUserID', payload:number}
    |{type:'changeUserName',payload:string}
    |{type:'changeToken',payload:string}
    |{type:'changeZoneId',payload:number}
    |{type:'changeTicket',payload:Vale}
    |{type:'removeTicket'}
    |{type:'changeUniqueAppID',payload:string}
    |{type:'changeEmpresaID', payload:number}



export const authReducer=(state:AuthState, action:AuthAction): AuthState =>{
// reducer only allos a certain number of states
    switch (action.type) {
        case 'signIn':
            return {
                ...state,
                isLoggedIn:true,
            };
        case 'logOut':
            return{
                ...state,
                isLoggedIn:false,
                userID:undefined,
                userName:undefined,
                token:undefined,
                zoneID:undefined,
                ticket:undefined,
                appUniqueID:undefined
            }
        case'changeUserID':
            return{
                ...state,
                userID:action.payload,
            }
        case'changeEmpresaID':
            return{
                ...state,
                empresaID:action.payload,
            }
        case'changeUserName':
        return{
            ...state,
            userName:action.payload
        }
        case'changeToken':
        return{
            ...state,
            token:action.payload
        }
        case'changeZoneId':
        return{
            ...state,
            zoneID:action.payload
        }
        case'changeTicket':
        return{
            ...state,
            ticket:action.payload
        }
        case'removeTicket':
        return{
            ...state,
            ticket:undefined
        }
        case'changeUniqueAppID':
        return{
            ...state,
            appUniqueID:action.payload
        }
        default:
            return state;
    }
}