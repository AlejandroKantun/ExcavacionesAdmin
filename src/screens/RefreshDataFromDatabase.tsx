import React, { useEffect, useState } from 'react'
import { Button, View } from 'react-native'
import DeviceInfo from 'react-native-device-info';
import { postTicketsToDB, requestAndSaveClients, requestAndSaveDestinations, requestAndSaveDrivers, requestAndSaveMaterials, requestAndSaveTickets, requestAndSaveVehicles } from '../api/operationsToDB';
import CustomText from '../components/CustomText';
import { useTokenByUserPass } from '../hooks/useTokenByUserPass';



export const RefreshDataFromDatabase = () => {
   const {token,getToken} =useTokenByUserPass();
    const [deviceInfo, setdeviceId] = useState('')
   var userName ='Checador1';
   var password = 'Welcome1'
    useEffect(() => {
        const getTokenPage= async()=>{
            await getToken(userName, password);
        }
        
        getTokenPage();

        requestAndSaveVehicles(token,);
        requestAndSaveMaterials(token);
        requestAndSaveDrivers(token);
        requestAndSaveDestinations(token);
        requestAndSaveClients(token);
        requestAndSaveTickets(token);

    }, [])
  return (
    <View>
        <CustomText>
            This is the test screen 
        </CustomText>
        <CustomText>
            TOKEN:{token}
        </CustomText>
        <Button
            title='Press me to refresh'
            onPress={()=>{
                //requestAndSaveVehicles(token)
                DeviceInfo.getUniqueId().then((result)=>{
                    setdeviceId(result)
                });
                console.log(deviceInfo),
                postTicketsToDB(1,token)
            }}
        ></Button>
        
        <CustomText>
            DeviceID:{deviceInfo}
        </CustomText>
    </View>
  )
}

