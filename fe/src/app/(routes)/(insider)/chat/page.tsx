import Private from '@/components/auth/Private'
import VideoChatPage from '@/components/custom/VideoChat'
import React from 'react'

function Chat() {

  return (
    <div>
      <Private>
        <VideoChatPage />
      </Private>
    </div>
  )
}

export default Chat