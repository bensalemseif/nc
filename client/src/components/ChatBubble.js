import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../contexts/AuthContext";
import io from "socket.io-client";
import api from "../config/axiosConfig";
import { RiChat1Line } from "react-icons/ri";
import { VscClose } from "react-icons/vsc";

const ChatBubble = () => {
  const { user } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_SOCKET, {
      withCredentials: true,
    });

    const fetchOrCreateConversation = async () => {
      if (user) {
        try {
          let response = await api.get(`/chat/conversations`);
          if (response.status !== 200 || !response.data?.length) {
            response = await api.post(`/chat/conversations/`);
          }

          setConversation(response.data[0]);
          socket.current.emit("join", response.data[0]._id);

          socket.current.on("message", (message) => {
            if (message.conversationId === response.data[0]._id) {
              setConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, message],
              }));
            }
          });
        } catch (error) {
        }
      }
    };

    fetchOrCreateConversation();

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages, showChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      senderId: user._id,
      receiverId: conversation?.adminId._id,
      conversationId: conversation?._id,
    };

    try {
      const response = await api.post("chat/messages", messageData);
      socket.current.emit("message", response.data);
      setNewMessage("");
    } catch (error) {
    }
  };

  return (
    <>
      {user && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full shadow-lg ${
              showChat ? "bg-blue-600" : "bg-blue-500"
            }`}
          >
            <span className="text-white text-xl ">
              {showChat ? <VscClose /> : <RiChat1Line />}
            </span>
          </button>
          {showChat && (
            <div className="bg-white shadow-lg rounded-lg w-100 h-96 fixed bottom-20 right-4 flex flex-col border border-gray-200">
              <div className="bg-blue-500 text-white p-4 flex items-center justify-between rounded-t-lg">
                <h3 className="text-xl font-semibold">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white text-lg"
                >
                  ×
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                <div className="flex flex-col space-y-3">
                  {conversation?.messages?.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-xs text-sm break-words ${
                        msg.senderId === user._id
                          ? "bg-blue-100 text-blue-800 self-end text-right"
                          : "bg-gray-200 text-gray-800 self-start text-left"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="block text-xs text-gray-500 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="flex items-center border-t border-gray-300 p-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-2 rounded-full ml-2 hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBubble;
