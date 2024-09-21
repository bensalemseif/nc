import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../../contexts/AuthContext";
import api from "../../config/axiosConfig";
import io from "socket.io-client";

const AdminChatPage = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_SOCKET, {
      withCredentials: true,
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get("/chat/conversations");
        setConversations(response.data || []);
      } catch (error) {
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation?._id) {
      socket.current?.emit("join", selectedConversation._id);

      const handleMessage = (message) => {
        if (message?.conversationId === selectedConversation._id) {
          setSelectedConversation((prev) => ({
            ...prev,
            messages: [...(prev?.messages || []), message],
          }));
        }
      };

      socket.current?.on("message", handleMessage);

      return () => {
        socket.current?.off("message", handleMessage);
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleConversationSelect = async (convId) => {
    try {
      const response = await api.get(`/chat/conversations/${convId}/messages`);
      setSelectedConversation(response.data || {});
    } catch (error) {
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?._id || !selectedConversation?._id || !selectedConversation.userId?._id) return;

    const messageData = {
      text: newMessage,
      senderId: user._id,
      receiverId: selectedConversation.userId._id,
      conversationId: selectedConversation._id,
    };

    try {
      const response = await api.post("/chat/messages", messageData);
      socket.current?.emit("message", response.data);
      setNewMessage("");
    } catch (error) {
    }
  };

  const isRecipientKnown = selectedConversation?.userId?._id;

  return (
    <div className="sm:ml-64">
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Conversation List */}
        <div className="w-1/4 border-r border-gray-300 bg-white p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chats</h2>
          <ul className="space-y-4">
            {conversations
              .filter((conv) => conv.messages?.length > 0) // Filter out conversations with no messages
              .map((conv) => (
                <li
                  key={conv._id}
                  onClick={() => handleConversationSelect(conv._id)}
                  className="cursor-pointer flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <div className="bg-gray-300 h-12 w-12 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                    {conv.userId?.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="ml-4 flex-1">
                    <span className="text-lg font-medium text-gray-700">
                      {conv.userId?.userName || 'Unknown User'}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex flex-col bg-white shadow-lg">
          {selectedConversation ? (
            <div className="flex flex-col h-full w-full">
              {/* Chat Header */}
              <div className="bg-green-400 text-white p-4 flex items-center">
                <div className="bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                  {selectedConversation.userId?.userName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold">
                    {selectedConversation.userId?.userName || 'Unknown User'}
                  </h2>
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-grow overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-3">
                {selectedConversation.messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 mb-2 rounded-lg max-w-xs text-s break-words ${
                      msg.senderId === user?._id
                        ? "bg-green-400 text-white self-end text-right"
                        : "bg-gray-300 text-gray-800 self-start text-left"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white p-4 border-t border-gray-300 flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:border-green-400"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!isRecipientKnown}
                  className={`bg-green-400 text-white p-3 ml-3 rounded-lg shadow hover:bg-green-700 transition-colors ${!isRecipientKnown ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
