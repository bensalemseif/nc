import React from "react";

function UserList({ users, onSelectUser }) {
  return (
    <div className="flex flex-col">
      {users.map((user, index) => (
        <div
          key={user.id._id || index}
          className="flex items-center py-4 px-2 justify-center border-b-2 cursor-pointer hover:bg-gray-200 rounded-lg"
          onClick={() => onSelectUser(user)}
        >
          <div className="w-1/4">
            <img
              src={`${user.id.image}`}
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">{user.id.name}</div>
            <span className="text-gray-500">{user.lastMessage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
