import React, { useEffect, useState } from "react";

const FindRoom = () => {
  const socket = new WebSocket("ws://localhost:3001/ws/");

  const [message, setMessage] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleMessage = () => {
      socket.send(JSON.stringify({
          message: input
      }))
  };

  const handleSetInput = () => {
    setInput(input);
  };

  useEffect(() => {
    socket.onopen = () => {
      console.log("Connect");
    };

    socket.onmessage = (e) => {
      let mess = [...message];
      mess.push("Message: " + e.data);
      setMessage(mess);
    };

    return () => {
      socket.close();
    };
  });

  return (
    <div>
      <input type="text"  onChange={handleSetInput} />
    <button onClick={handleMessage}>SEND</button>
      <div>
        {message.map((value) => {
          return <div> {value} </div>;
        })}
      </div>
    </div>
  );
};

export default FindRoom;
