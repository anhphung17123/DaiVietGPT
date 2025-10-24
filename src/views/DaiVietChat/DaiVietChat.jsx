import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useCharacter } from "../../hooks/useApi";
import { API_CONFIG } from "../../constants/config";
import { formatDate } from "../../utils/helpers";
import Video from "../../components/Video/Video.jsx";
import LoadingDots from "../../components/LoadingDots/LoadingDots.jsx";
import "./DaiVietChat.css";
import introductionVideos from "../../assets/videos/initial_introduction/videoRoot.js";
import sandClockIcon from "../../assets/images/sand-clock.png";

const STREAM_URL = `${API_CONFIG.SERVER_URL}/chat/stream-post`;

const DaiVietChat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [talkingHeadVideo, setTalkingHeadVideo] = useState("");
  const [notification, setNotification] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const messagesEndRef = useRef();
  const typingQueueRef = useRef([]);
  const typingActiveRef = useRef(false);
  const videoRef = useRef(null);

  const { character, loading: characterLoading, error: characterError } = useCharacter(id);

  const seg = useMemo(() => new Intl.Segmenter("vi", { granularity: "grapheme" }), []);

  const typeEnqueue = useCallback(
    async (text) => {
      const parts = Array.from(seg.segment(text), (s) => s.segment);
      typingQueueRef.current.push(...parts);

      if (typingActiveRef.current) return; // đã có typer đang chạy

      typingActiveRef.current = true;
      while (typingQueueRef.current.length) {
        const piece = typingQueueRef.current.shift();

        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const lastIdx = prev.length - 1;
          const last = prev[lastIdx];
          const updated = [...prev];
          updated[lastIdx] = { ...last, text: (last.text || "") + piece, isLoading: false };
          return updated;
        });

        await new Promise((r) => setTimeout(r, 8));
      }
      typingActiveRef.current = false;
    },
    [seg, setMessages]
  );

  function buildHistoryForGemini(messages) {
    return messages
      .filter((m) => m.text && m.text !== "video")
      .map((m) => ({
        role: m.sender === "Chat Bot" ? "model" : "user",
        text: m.text
      }));
  }

  const handleStart = useCallback(() => {
    if (!character) return;

    setHasStarted(true);

    // Hiển thị message chào
    setMessages([
      {
        text: `Xin chào, tôi là ${character.name}, tôi có thể giúp gì cho bạn?`,
        sentTime: new Date().toISOString(),
        sender: "Chat Bot"
      }
    ]);

    // Phát video introduction nếu có
    if (introductionVideos[character.code]) {
      setTalkingHeadVideo(introductionVideos[character.code]);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }, 500);
    }
  }, [character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateTalkingHeadVideo = useCallback(
    async (text) => {
      try {
        if (
          introductionVideos[character.code] &&
          text === `Xin chào, tôi là ${character.name}, tôi có thể giúp gì cho bạn?`
        ) {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
          }
          setTalkingHeadVideo(introductionVideos[character.code]);
          return;
        }

        if (localStorage.getItem(text)) {
          setTalkingHeadVideo(localStorage.getItem(text));
          return;
        }

        setIsGeneratingVideo(true);

        const formData = new FormData();
        formData.append("text", text);

        const response = await fetch(`https://kirstie-unthinkable-vita.ngrok-free.dev/generate_video`, {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        const base64Video = res.data;

        // Tạo URL Blob từ dữ liệu base64
        const byteCharacters = atob(base64Video);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(blob);

        setTalkingHeadVideo(videoUrl);

        // Lưu tạm lại videoUrl để cho phép phát lại video đó
        localStorage.setItem(text, videoUrl);
      } catch (error) {
        console.warn("Text-to-speech API failed, using mock video:", error.message);
      } finally {
        setIsGeneratingVideo(false);
      }
    },
    [character]
  );

  const fetchMessage = useCallback(
    async (chatMessages, newMessage) => {
      const skeletonMessage = {
        text: "",
        sentTime: new Date().toISOString(),
        sender: "Chat Bot",
        isLoading: false
      };

      setMessages([...chatMessages, skeletonMessage]);

      try {
        const payload = {
          name: character?.name || "DefaultName",
          message: newMessage.text,
          history: buildHistoryForGemini(chatMessages)
        };

        const res = await fetch(STREAM_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        if (!res.body) {
          throw new Error("No stream body");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          await typeEnqueue(chunk);
        }

        // Sau khi nhận đầy đủ các chunk, gọi generateTalkingHeadVideo
        if (fullText.trim()) {
          await generateTalkingHeadVideo(fullText);
        }
      } catch (error) {
        console.warn("Chat stream API failed, using mock response:", error?.message);
      }
    },
    [character, typeEnqueue, generateTalkingHeadVideo]
  );

  const handleSend = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      text: inputMessage.trim(),
      sentTime: new Date().toISOString(),
      sender: "me"
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    await fetchMessage(updatedMessages, newMessage);
  }, [inputMessage, messages, fetchMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleRecord = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  }, []);

  if (characterLoading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải nhân vật...</p>
      </div>
    );
  }

  if (characterError) {
    return (
      <div className="chat-error">
        <p>Có lỗi xảy ra khi tải nhân vật. Vui lòng thử lại.</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="chat-error">
        <p>Không tìm thấy nhân vật.</p>
      </div>
    );
  }

  return (
    <div className="chatBox">
      {notification && <div className="notification">{notification}</div>}

      <div className="chatBox-video">
        {isGeneratingVideo && (
          <div className="video-loading-overlay">
            <img src={sandClockIcon} alt="Loading" className="sand-clock-icon" />
            <p>Đang tạo video...</p>
          </div>
        )}
        {talkingHeadVideo ? (
          <video ref={videoRef} controls autoPlay src={talkingHeadVideo} className="character-video">
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        ) : (
          <img src={character.background} alt={`${character.name} background`} className="character-background" />
        )}
      </div>

      <div className="chatBox-main">
        <div className="chatBox-header">
          <div className="chatBox-header-title">
            <h3>Nhân vật {character.name}</h3>
          </div>
        </div>
        
        {!hasStarted ? (
          <div className="start-screen">
            <button className="start-button" onClick={handleStart}>
              Bắt đầu
            </button>
          </div>
        ) : (
          <>
            <div className="chatBox-body">
              <div className="chatBox-body-content">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chatBox-body-content-message ${
                      message.sender === "Chat Bot" ? "chatBox-message__incoming" : "chatBox-message__outgoing"
                    }`}
                  >
                    <div className="chatBox-body-content-message-item">
                      <div className="chatBox-body-content-message-item-avatar">
                        <img
                          src={
                            message.sender === "Chat Bot"
                              ? character.avatar
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpA2R5kbHzeMT2Yhb8CZi7D6xYE2tpjhD62w&s"
                          }
                          alt={message.sender === "Chat Bot" ? `${character.name} avatar` : "User avatar"}
                        />
                      </div>
                      <div className="chatBox-body-content-message-item-content">
                        {message.text === "video" ? (
                          <Video videoUrls={message.videoUrls} />
                        ) : !message.text || message.text.trim() === "" ? (
                          <div className="message-loading">
                            <LoadingDots />
                          </div>
                        ) : (
                          <div className="message-content">
                            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{message.text}</p>
                            {message.sender === "Chat Bot" && (
                              <div className="message-actions">
                                <button
                                  className="action-button"
                                  onClick={() => generateTalkingHeadVideo(message.text)}
                                  title="Phát âm thanh"
                                >
                                  🔊
                                </button>
                                <button
                                  className="action-button"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(message.text);
                                      setNotification("Đã sao chép tin nhắn!");
                                      setTimeout(() => setNotification(""), 2000);
                                    } catch (err) {
                                      console.error("Failed to copy text: ", err);
                                    }
                                  }}
                                  title="Sao chép"
                                >
                                  📋
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="message-time">{formatDate(message.sentTime)}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="chatBox-body-input">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={characterLoading}
              />
              <button
                className={`mic-button ${isRecording ? "recording" : ""}`}
                onClick={handleRecord}
                disabled={characterLoading}
                aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
              >
                <FontAwesomeIcon icon={isRecording ? faCircle : faMicrophone} color={isRecording ? "red" : "white"} />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || characterLoading}
                className="send-button"
                aria-label="Gửi tin nhắn"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DaiVietChat;
