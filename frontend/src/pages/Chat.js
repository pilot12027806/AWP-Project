import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import Sidebar from "../components/Sidebar";

const GET_ADMINS = gql`
  query GetAdmins($userId: Int!) {
    getAdmins(userId: $userId) {
      id
      username
      email
      role
    }
  }
`;

const GET_CHAT_HISTORY = gql`
  query ($senderId: Int!, $receiverId: Int!) {
    getMessages(senderId: $senderId, receiverId: $receiverId) {
      id
      message
      senderId
      receiverId
      timestamp
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($message: String!, $senderId: Int!, $receiverId: Int!) {
    sendMessage(
      message: $message
      senderId: $senderId
      receiverId: $receiverId
    ) {
      id
      message
      senderId
      receiverId
      timestamp
    }
  }
`;

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription Subscription($receiverId: Int!) {
    messageReceived(receiverId: $receiverId) {
      id
      message
      senderId
      receiverId
      timestamp
    }
  }
`;

const Chat = () => {
  const userId = parseInt(localStorage.getItem("id"), 10);

  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const {
    loading: loadingAdmins,
    error: errorAdmins,
    data: adminsData,
  } = useQuery(GET_ADMINS, {
    variables: { userId: userId },
  });
  const admins = adminsData?.getAdmins || [];

  const {
    loading: loadingChatHistory,
    error: errorChatHistory,
    data: chatHistoryData,
    refetch: refetchChatHistory,
  } = useQuery(GET_CHAT_HISTORY, {
    variables: { senderId: userId, receiverId: selectedAdminId },
    skip: !selectedAdminId, // Skip query if no admin is selected
  });

  useEffect(() => {
    let intervalId;
    if (selectedAdminId) {
      intervalId = setInterval(() => {
        refetchChatHistory();
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [selectedAdminId, refetchChatHistory]);

  const chatHistory = chatHistoryData?.getMessages || [];

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { senderId: userId, receiverId: selectedAdminId },
    skip: !selectedAdminId,
    onSubscriptionData: ({ subscriptionData }) => {
      const newMsg = subscriptionData.data.newMessage;
      refetchChatHistory(); // Refetch the chat history to include the new message
    },
  });

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedAdminId) {
      try {
        await sendMessage({
          variables: {
            message: newMessage,
            senderId: userId,
            receiverId: selectedAdminId,
          },
        });
        setNewMessage("");
        refetchChatHistory();
      } catch (error) {
        console.error("Failed to send message:", error.message);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold mb-6">Chat with Admins</h1>

        {loadingAdmins ? (
          <p>Loading admins...</p>
        ) : errorAdmins ? (
          <p>Error loading admins: {errorAdmins.message}</p>
        ) : (
          <div className="flex flex-wrap gap-4 mb-6">
            {admins.map((admin) => (
              <div
                key={admin.id}
                onClick={() => setSelectedAdminId(admin.id)}
                className={`cursor-pointer flex flex-col items-center ${
                  selectedAdminId === admin.id ? "opacity-100" : "opacity-70"
                }`}
              >
                <img
                  src={"https://via.placeholder.com/40"}
                  alt={admin.username}
                  className="w-10 h-10 rounded-full mb-1"
                />
                <span className="text-sm">{admin.username}</span>
              </div>
            ))}
          </div>
        )}

        {selectedAdminId ? (
          <div className="bg-gray-800 p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">
              Chat with:{" "}
              {admins.find((admin) => admin.id === selectedAdminId)?.username}
            </h2>

            <div className="h-64 overflow-y-auto bg-gray-900 p-4 rounded mb-4">
              {loadingChatHistory ? (
                <p>Loading chat history...</p>
              ) : errorChatHistory ? (
                <p>Error loading chat history: {errorChatHistory.message}</p>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`mb-2 ${
                      chat.senderId === userId
                        ? "text-green-400"
                        : "text-blue-400"
                    }`}
                  >
                    <strong>
                      {chat.senderId === userId
                        ? "You"
                        : admins.find((admin) => admin.id === selectedAdminId)
                            ?.username}
                      :
                    </strong>{" "}
                    {chat.message}
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white p-2 rounded w-full sm:w-auto"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 mt-4">
            Select an admin to start chatting.
          </p>
        )}
      </main>
    </div>
  );
};

export default Chat;
