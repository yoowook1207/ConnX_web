// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client'
import {useGetCalls} from "@/hooks/useGetCalls";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Call, CallRecording} from "@stream-io/video-react-sdk";
import MeetingCard from "@/components/MeedingCard";
import Loader from "@/components/Loader";

const CallList = ({type}: {type: 'ended' | 'upcoming' |'recordings'}) => {
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
    const router = useRouter();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    const getCalls = () => {
      switch (type) {
          case 'ended':
            return endedCalls;
          case 'upcoming':
            return upcomingCalls;
          case'recordings':
            return recordings;
          default:
            return [];
      }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading) return <Loader />

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length >0 ? calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call)?.id}
                    icon={
                        type === 'ended'
                            ? '/icons/previous.svg'
                            : type === 'upcoming'
                                ? '/icons/upcoming.svg'
                                : '/icons/recordings.svg'
                    }
                    title={(meeting as Call).state.custom.description.substring(0, 25) || 'No description'}
                    date={meeting.state.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    handleClick={type === 'recordings' ? () => {
                        router.push(`${meeting.url}`)
                    } : () => {
                        router.push(`/meeting/${meeting.id}`)
                    }}
                    link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                    buttonText={type === 'recordings' ? 'Play' : 'Start'}
                />
            )): (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    );
};

export default CallList;