import React, { useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

const dbCreatedSession='dbCreatedSession';

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