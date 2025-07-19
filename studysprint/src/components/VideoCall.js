import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

const appId = process.env.REACT_APP_AGORA_APP_ID;

// Create a new client instance for each call
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function VideoCall() {
  const { groupId } = useParams(); // Get the group ID from the URL
  const navigate = useNavigate();

  // State to control joining the call
  const [isJoined, setIsJoined] = useState(false);

  // Get local camera and microphone tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  
  // Custom hook to join the channel
  useJoin({
    appid: appId,
    channel: groupId,
    token: null, // No token needed for testing
  }, isJoined);

  // Custom hook to publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack], isJoined);

  // Get remote users
  const remoteUsers = useRemoteUsers();

  const handleLeave = () => {
    // Stop tracks and navigate away
    if (localCameraTrack) {
      localCameraTrack.stop();
      localCameraTrack.close();
    }
    if (localMicrophoneTrack) {
      localMicrophoneTrack.stop();
      localMicrophoneTrack.close();
    }
    setIsJoined(false);
    navigate('/');
  };

  return (
    <div className="video-call-container">
      {!isJoined ? (
        <div className="join-call-screen">
          <h3>Ready to join the study session?</h3>
          <button className="form-button" onClick={() => setIsJoined(true)}>
            Join Call
          </button>
        </div>
      ) : (
        <>
          <div className="video-player-grid">
            {/* Local User's Video */}
            <div className="video-player">
              <LocalVideoTrack track={localCameraTrack} play={true} />
              <div className="video-label">You</div>
            </div>

            {/* Remote Users' Videos */}
            {remoteUsers.map((user) => (
              <div className="video-player" key={user.uid}>
                <RemoteUser user={user} playVideo={true} playAudio={true} />
                 <div className="video-label">{user.uid}</div>
              </div>
            ))}
          </div>
          <div className="video-controls">
            <button onClick={handleLeave} className="logout-button">
              Leave Call
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Wrap the main component with the AgoraRTCProvider
const AgoraVideoCall = () => {
  return (
    <AgoraRTCProvider client={client}>
      <VideoCall />
    </AgoraRTCProvider>
  );
};

export default AgoraVideoCall;