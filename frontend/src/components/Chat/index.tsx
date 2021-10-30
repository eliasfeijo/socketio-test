import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppContext, IUser } from "../../contexts/AppContext";
import io, { Socket } from "socket.io-client";

const Chat = (): JSX.Element => {
  const { state } = useContext(AppContext);

  const history = useHistory();

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(`http://localhost:3000/ws`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  const [message, setMessage] = useState("");

  interface ChatMessage {
    from: IUser | null;
    date: number;
    message: string;
  }

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({});
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!connected) {
      setConnected(true);
      if (!state.user || !state.token) {
        history.push("/");
        return;
      }
      const msg = {
        from: null,
        date: Date.now(),
        message: `${state.user.name} connected to the chat.`,
      };
      setChatMessages([...chatMessages, msg]);
    }
  }, [chatMessages, connected, history, state.token, state.user]);

  const renderChatMessages = () => {
    return chatMessages.map((chatMessage) => {
      const from = chatMessage.from?.name || "SYSTEM";
      return (
        <p key={chatMessage.date} className="p-2">
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
