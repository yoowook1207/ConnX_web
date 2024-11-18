'use client';
import React, {useState} from 'react';
import {useUser} from "@clerk/nextjs";
import {StreamCall, StreamTheme} from "@stream-io/video-react-sdk";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";

const Meeting = () => {
    const {user, isLoaded} = useUser();
    const [isSetupComplete, setIsSetupComplete] = useState(false);


    return (
        <main className="h-screen w-full">
            <StreamCall call={}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <MeetingSetup/>
                    ): (
                        <MeetingRoom/>
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    );
};

export default Meeting;