"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import userImage from "@/images/user.png";
import Message from "./message"
import { format } from 'date-fns'; // Import date-fns

interface Message {
  message_id: number
  message_date: string; // Use the actual field name from the response
  message_content: string; // Use the actual field name from the response
  message_receiver_id: number
}

function Chat() {
  const chat_appointmentId = localStorage.getItem("chat_appointmentId");
  const chat_doctorId = localStorage.getItem("chat_doctorId");
  const chat_doctorfirstname = localStorage.getItem("chat_doctor_firstname");
  const chat_doctorlastname = localStorage.getItem("chat_doctor_lastname");

  const [inputValue, setInputValue] = useState("");
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  console.log(chat_appointmentId)
  console.log(chat_doctorId)
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      window.location.href = "/auth/signin";
    } else if (
      Math.floor(new Date().getTime() / 1000) >
      Number(localStorage.getItem("expiryDate"))
    ) {
      localStorage.clear();
      window.location.href = "/auth/signin";
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_NAME}/appointment-chat/${chat_appointmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            mode: "cors",
          }
        );
        if (response.status === 404) {
          // No previous messages available
          console.log("No previous messages found.");
          setMessagesList([]); // Or handle it differently, e.g., show a message to the user
        } else if (response.ok) {
          const chat = await response.json();
          console.log(chat)
          setMessagesList(chat);
        } else {
          console.error("Error fetching messages:", response.status);
          // Handle other error statuses if needed
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
    // Set up interval to fetch new messages periodically
    const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [chat_appointmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!inputValue) {
      console.log("Cannot send an empty message");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}/appointment-chat`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverId: chat_doctorId,
            message: inputValue,
            appointmentId: chat_appointmentId,
          }),
        }
      );

      if (response.ok) {
        // Message sent successfully, clear input field and update messagesList
        setInputValue("");

        // Construct the new message object
        const newMessage: Message = {
          message_id: Date.now(), // You might need a better way to generate a unique ID
          message_date: new Date().toISOString(),
          message_content: inputValue,
          message_receiver_id: parseInt(chat_doctorId!),
        };

        // Update messagesList with the new message
        setMessagesList(prevMessages => [...prevMessages, newMessage]);

      } else {
        console.error("Error sending message:", response.status);
        // Handle the error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };


  return (
    <div className="flex justify-center">
      <div className="flex flex-col m-2 h-[600px] w-[600px] bg-white">
        <div className="p-2 border-solid border-[1px] border-zinc-200 h-[10%]">
          <div className="flex mx-2 justify-between items-center">
            <div className="flex gap-2 items-center">
              <Image className="inline-block h-10 w-10 rounded-full" src={userImage} alt="Doctor Image" />
              <p className="font-bold">Dr. {chat_doctorfirstname}{" "}{chat_doctorlastname}</p>
            </div>
            <button
              onClick={() => (window.location.href = "/doctorProfile/requests")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hover:scale-105 hover:cursor-pointer"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="h-3/4 border-solid border-x-[1px] border-x-zinc-300 p-2 overflow-y-scroll">
          {messagesList.map((message) => (
            <div
              key={message.message_id}
              className={`flex ${message.message_receiver_id === parseInt(chat_doctorId!) ? 'justify-end' : 'justify-start'}`}
            >
              <Message
                time={format(new Date(message.message_date), 'dd/MM HH:mm')}
                text={message.message_content}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-2 border-solid border-[1px] border-zinc-300 items-center h-[15%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-2 size-6 hover:scale-105 hover:cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
            />
          </svg>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-[81%] p-2.5"
            placeholder="Aa"
            value={inputValue}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="inline-block h-8 w-8 bg-blue-600 stroke-blue-600 rounded-full size-6 fill-white hover:scale-105 hover:cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;