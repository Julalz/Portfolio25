import React, { useState, useRef, useEffect } from 'react';
import './RecruiterChat.css';

const RecruiterChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDownloadCV = async () => {
    try {
      const response = await fetch('https://backend-fastapi-portfolio-568h72nrh-julalzs-projects.vercel.app/api/download-cv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV_Julian_Alzate.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el CV:', error);
    }
  };

  const handleContactInfo = async () => {
    try {
      const response = await fetch('https://backend-fastapi-portfolio-568h72nrh-julalzs-projects.vercel.app/api/contact-info');
      const data = await response.json();
      const contactMessage = {
        text: `Puedes contactar a Julian:\nTeléfono: ${data.phone}\nEmail: ${data.email}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, contactMessage]);
    } catch (error) {
      console.error('Error al obtener información de contacto:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await fetch('https://backend-fastapi-portfolio-568h72nrh-julalzs-projects.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      // Separar la respuesta base y las opciones
      const [baseResponse, ...options] = data.response.split('\n\n');
      
      const botMessage = {
        text: baseResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        options: options.join('\n\n')
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const renderMessageContent = (message) => {
    if (message.sender === 'bot' && message.options) {
      return (
        <div className="message-content">
          <p>{message.text}</p>
          <div className="options-container">
            <button onClick={handleContactInfo} className="option-button">
              Hablar con Julian
            </button>
            <button onClick={handleDownloadCV} className="option-button">
              Descargar CV
            </button>
          </div>
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
            {renderMessageContent(message)}
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
    </div>
  );
};

export default RecruiterChat; 