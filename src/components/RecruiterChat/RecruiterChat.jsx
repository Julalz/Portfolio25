import React, { useState, useRef, useEffect } from "react";
import "./RecruiterChat.css";

const RecruiterChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scrollToBottom = () => {
    if (hasInteracted && !loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleDownloadCV = async () => {
    try {
      const response = await fetch(
        "https://backend-1052251631121.us-central1.run.app/api/download-cv"
      );

      if (!response.ok) {
        throw new Error(`Error al descargar el CV: ${response.statusText}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV_Julian_Alzate.pdf";

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      await fetch(
        "https://backend-1052251631121.us-central1.run.app/api/increment-cv-downloads",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from_chat: true }),
        }
      );

      console.log("CV descargado exitosamente");
    } catch (error) {
      console.error("Error al descargar el CV:", error);
      alert(
        "Hubo un problema al intentar descargar el CV. Intenta nuevamente más tarde."
      );
    }
  };

  const handleContactInfo = async () => {
    try {
      const contactMessage = {
        text: `Puedes contactar a Julian:\nTeléfono: 633 32 6622 Email:Julian942@hotmail.com`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, contactMessage]);
    } catch (error) {
      console.error("Error al obtener información de contacto:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setHasInteracted(true);
    const newMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setLoading(true);

    setUserMessageCount((prev) => prev + 1);

    try {
      const response = await fetch(
        "https://backend-1052251631121.us-central1.run.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      if (data && data.response) {
        const [baseResponse, ...options] = data.response.split("\n\n");
        const botMessage = {
          text: baseResponse,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, botMessage]);

        if (userMessageCount >= 2) {
          setTimeout(() => {
            const buttonMessage = {
              text: "",
              sender: "bot",
              timestamp: new Date().toLocaleTimeString(),
              buttons: true,
            };

            setMessages((prev) => [...prev, buttonMessage]);
          }, 200);
        }
      } else {
        console.error("Respuesta no válida del backend:", data);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (message, index) => {
    const isLastMessage = index === messages.length - 1;

    if (message.sender === "bot" && message.buttons) {
      return (
        <div className="message-content">
          {isLastMessage && userMessageCount >= 2 && (
            <div className="options-container">
              <p>¿Quieres hablar mejor con Julián?</p>
              <button onClick={handleContactInfo} className="option-button">
                Datos de contacto de Julian
              </button>
              <button onClick={handleDownloadCV} className="option-button">
                Descargar CV
              </button>
            </div>
          )}
          <span className="timestamp">{message.timestamp}</span>
        </div>
      );
    }

    return (
      <div className="message-content">
        <p>{message.text}</p>
        <span className="timestamp">{message.timestamp}</span>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Hola soy el Cv interactivo de Julian Alzate</h3>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {renderMessageContent(message, index)}{" "}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Preguntame lo que quieras..."
        />
        <button type="submit">Enviar 🤖</button>
      </form>
      {loading && <div className="loading-spinner">Cargando...</div>}
    </div>
  );
};

export default RecruiterChat;
