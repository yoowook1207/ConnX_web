'use client'
import React, {useEffect, useState} from 'react';
import MeetingTypeList from "@/components/MeetingTypeList";
import {useGetCalls} from "@/hooks/useGetCalls";
import Loader from "@/components/Loader";
import {Call} from "@stream-io/video-react-sdk";

const Home = () => {
    const { upcomingCalls, isLoading } = useGetCalls();
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const now = new Date();
    let meetingMessage = "No scheduled meeting today";
    const closestMeeting = upcomingCalls.reduce<Call | null>((closest, call) => {
        const currentMeetingTime = call?.state?.startsAt ? new Date(call.state.startsAt) : null;
        const closestMeetingTime = closest?.state?.startsAt ? new Date(closest.state.startsAt) : null;


        // If there's no closest meeting yet or the current meeting is closer, update the closest
        return !closestMeetingTime || (currentMeetingTime && currentMeetingTime < closestMeetingTime)
            ? call
            : closest;
    }, null);

    if (closestMeeting?.state?.startsAt) {
        const meetingTime = new Date(closestMeeting.state.startsAt);

        // Check if the closest meeting is today
        if (
            meetingTime.getFullYear() === now.getFullYear() &&
            meetingTime.getMonth() === now.getMonth() &&
            meetingTime.getDate() === now.getDate()
        ) {
            // Format time as "hh:mm AM/PM"
            meetingMessage = meetingTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    }

    useEffect(() => {
        const updateTimeAndDate = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            setDate(new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now));
        };

        updateTimeAndDate(); // Set initial time and date
        const interval = setInterval(updateTimeAndDate, 1000);

        return () => clearInterval(interval);
    }, []);



    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
                <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
                            Upcoming Meeting at: {meetingMessage}
                        </h2>
                    )}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold lg:text-7xl">
                            {time}
                        </h1>
                        <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
                    </div>
                </div>
            </div>
            <MeetingTypeList />
        </section>
    );
};

export default Home;