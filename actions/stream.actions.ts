'use server';
import {currentUser} from "@clerk/nextjs/server";
import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();
    if (!user) throw new Error('User is not logged in');
    if(!apiKey || !apiSecret) throw new Error('No API key');
    if(!apiSecret) throw new Error('No API secret');

    // const newUser: UserRequest = {
    //     id: user.id,
    //     role: 'user',
    //     custom: {
    //         color: 'red',
    //     },
    //     name: "user.firstName + ' ' + user.lastName",
    //     image: user.imageUrl,
    // };
    // await client.upsertUsers([newUser]);

    const client = new StreamClient(apiKey, apiSecret);
    const validity = 60 * 60; // in seconds
    const issued = Math.floor(Date.now() / 1000) -60;

    const token = client.generateUserToken({
        user_id: user.id,
        validity_in_seconds: validity,
        iat: issued
    });

    return token;
}