import React, { useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

const dbCreatedSession='dbCreatedSession';
const dbUsersInPhone='dbUsersInPhone';

export async function storeDBCreated() {
    try {
        console.log('storing db')

        await EncryptedStorage.setItem(
            dbCreatedSession,
            JSON.stringify({
                dbCreated:true
            })
        );
    } catch (error) { }
}

export async function isDBCreated() {

    try {   

        const session = await EncryptedStorage.getItem(dbCreatedSession);
        if (session !== undefined) {
            console.log(session)
        }
    } catch (error) {
        console.log(error)

    }
   
}

export async function storeUser(userName:string) {
    let users:string=userName+'';
   
    getUserslogged().then(async (usersInDB)=>{
        if (usersInDB){
            users=users+','+usersInDB;

        }
        try {
                await EncryptedStorage.setItem(
                    dbUsersInPhone,
                    users
                );
            } catch (error) { }
        
    })

    
}

export async function getUserslogged() {
    let users:string=''

    const promise =   new Promise(
        async (resolve, reject) => {

            try {   
                const session = await EncryptedStorage.getItem(dbUsersInPhone);
                console.log('trying to extract session: ' + JSON.stringify(session))

                if (session !== undefined) {

                    console.log(session)
                    resolve(session)
                }else{
                    resolve(null)
                }
            } catch (error) {
                console.log(error)

            }
        })
    await promise.then((res )=>{
        users=res as string
        return users
    })
    return users;
   
}