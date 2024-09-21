import React, { useState } from "react";

function Conversation({ user }) {
  const [messages, setMessages] = useState([
    { sender: "You", text: "Hi, how are you?" },
    { sender: user.name, text: "I'm good, thanks!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Conversation with {user.name}</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner h-64 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === "You" ? "text-right" : ""}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Conversation;
