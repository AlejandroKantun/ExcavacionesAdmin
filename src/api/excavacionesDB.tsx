import axios, { AxiosInstance } from "axios";
import globalSettings from '../globalSettings';

const excavacionesDB=axios.create({
    baseURL:globalSettings.Api.prodEndPoint,
    params:{
        appUniqueID:'2',
    }
    });


export default excavacionesDB;


