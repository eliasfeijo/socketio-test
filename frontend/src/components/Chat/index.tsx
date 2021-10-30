import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppContext, IUser } from "../../contexts/AppContext";
import io, { Socket } from "socket.io-client";

const Chat = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const history = useHistory();

  const socket = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!state.user || !state.token) {
      history.push("/");
      return;
    }
    if (!connected) {
      console.log("setting socket...");
      socket.current = io("http://localhost:3000", {
        path: "/ws/",
        extraHeaders: { Authorization: `Bearer ${state.token}` },
      });
      setConnected(true);
      socket.current.on("message", (msg) => {
        msg = JSON.parse(msg);
        setChatMessages([...chatMessages, msg]);
      });
    }
  }, [chatMessages, connected, history, state.token, state.user]);

  const [message, setMessage] = useState("");

  interface ChatMessage {
    from: IUser | null;
    date: number;
    message: string;
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({});
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const renderChatMessages = () => {
    return chatMessages.map((chatMessage) => {
      const from = chatMessage.from?.name || "SYSTEM";
      const date = new Date(chatMessage.date);
      return (
        <p key={chatMessage.date} className="p-2">
          <i>
            {date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()}:
            {date.getMinutes() >= 10
              ? date.getMinutes()
              : "0" + date.getMinutes()}
            :
            {date.getSeconds() >= 10
              ? date.getSeconds()
              : "0" + date.getSeconds()}
          </i>{" "}
          <b>{from}:</b>{" "}
          <span className="break-all">{chatMessage.message}</span>
        </p>
      );
    });
  };

  const onKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && message && message.trim() !== "") {
      const msg: ChatMessage = {
        from: state.user,
        date: Date.now(),
        message: message,
      };
      setChatMessages([...chatMessages, msg]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-4">
      <div className="flex flex-col h-5/6 w-full rounded bg-gray-300 overflow-y-auto">
        {renderChatMessages()}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-row w-full h-1/6 rounded bg-gray-300 mt-4 items-center">
        <input
          type="text"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          onKeyPress={onKeyPress}
          className="w-full h-1/2 mx-4"
        />
      </div>
    </div>
  );
};

export default Chat;
