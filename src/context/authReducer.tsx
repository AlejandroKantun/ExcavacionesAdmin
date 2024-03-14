import { AuthState } from './AuthContext';
type AuthAction=
    |{type:'signIn'}
    |{type:'logOut'}
    |{type:'changeUserID', payload:number}
    |{type:'changeUserName',payload:string}
    |{type:'changeToken',payload:string}
    |{type:'changeZoneId',payload:number}



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
                zoneID:undefined
            }
        case'changeUserID':
            return{
                ...state,
                userID:action.payload,
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
        
        default:
            return state;
    }
}