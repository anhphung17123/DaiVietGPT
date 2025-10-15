import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useCharacter } from "../../hooks/useApi";
import { API_CONFIG } from "../../constants/config";
import { removeAccentsAndSpaces, formatDate } from "../../utils/helpers";
import downloadAll from "../../services/downloader.js";
import Video from "../../components/Video/Video.jsx";
import { MOCK_CHAT_RESPONSES, MOCK_VIDEO_URLS } from "../../data/mockData";
import "./DaiVietChat.css";

const STREAM_URL = `${API_CONFIG.SERVER_URL}/chat/stream-post`;

const DaiVietChat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speech, setSpeech] = useState("");
  const [notification, setNotification] = useState("");
  const messagesEndRef = useRef();
  const typingQueueRef = useRef([]);
  const typingActiveRef = useRef(false);

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

        // tốc độ gõ: 6–12ms/ký tự (tuỳ)
        await new Promise((r) => setTimeout(r, 8));
      }
      typingActiveRef.current = false;
    },
    [seg, setMessages]
  );

  function buildHistoryForGemini(messages) {
    // chỉ lấy n lượt gần nhất nếu muốn, vd: slice(-8)
    return messages
      .filter((m) => m.text && m.text !== "video")
      .map((m) => ({
        role: m.sender === "Chat Bot" ? "model" : "user",
        text: m.text
      }));
  }

  useEffect(() => {
    if (character) {
      setMessages([
        {
          text: `Xin chào, tôi là ${character.name}, tôi có thể giúp gì cho bạn?`,
          sentTime: new Date().toISOString(),
          sender: "Chat Bot"
        }
      ]);
    }
  }, [character]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const textToSpeech = useCallback(
    async (text) => {
      try {
        const response = await fetch(`${API_CONFIG.API_BASE_URL}${API_CONFIG.ENDPOINTS.TEXT_TO_VIDEO}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text,
            name: removeAccentsAndSpaces(character?.name || "TranHungDao")
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSpeech(data.video_url);
      } catch (error) {
        console.warn("Text-to-speech API failed, using mock video:", error.message);

        // Use mock video URL
        const mockVideoUrl = MOCK_VIDEO_URLS[Math.floor(Math.random() * MOCK_VIDEO_URLS.length)];
        setSpeech(mockVideoUrl);
      }
    },
    [character]
  );

  const fetchMessage = useCallback(
    async (chatMessages, newMessage) => {
      // Thêm 1 message “rỗng” để đổ dần chunk vào
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

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          await typeEnqueue(chunk);
        }

        // Stream xong thì gọi TTS (nếu bạn muốn phát audio/video sau khi hoàn tất)
        //   if (fullText.trim()) {
        //     textToSpeech(fullText);
        //   }
      } catch (error) {
        console.warn("Chat stream API failed, using mock response:", error?.message);

        // fallback mock như code cũ
        const characterName = character?.name || "Trần Hưng Đạo";
        const mockResponses = MOCK_CHAT_RESPONSES[characterName] || MOCK_CHAT_RESPONSES["Trần Hưng Đạo"];
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const lastIdx = prev.length - 1;
          const last = prev[lastIdx];
          const updated = [...prev];
          updated[lastIdx] = { ...last, text: randomResponse, isLoading: false };
          return updated;
        });

        //   textToSpeech(randomResponse);
      }
    },
    [character, typeEnqueue]
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

    //   if (inputRef.current?.getIsChecked() === false) {

    //   } else {
    //     await handleSendVideo(updatedMessages, newMessage);
    //   }
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

  const handleSendVideo = useCallback(async (chatMessages, newMessage) => {
    const skeletonMessage = {
      text: "Đang tạo video...",
      sentTime: new Date().toISOString(),
      sender: "Chat Bot",
      isLoading: true
    };

    setMessages([...chatMessages, skeletonMessage]);

    try {
      const videoUrls = await downloadAll(newMessage.text);
      const newMessageReply = {
        text: "video",
        videoUrls: videoUrls,
        sentTime: new Date().toISOString(),
        sender: "Chat Bot",
        isLoading: false
      };
      setMessages([...chatMessages, newMessageReply]);
    } catch (error) {
      console.warn("Video generation API failed, using mock videos:", error.message);

      // Use mock video URLs
      const newMessageReply = {
        text: "video",
        videoUrls: MOCK_VIDEO_URLS,
        sentTime: new Date().toISOString(),
        sender: "Chat Bot",
        isLoading: false
      };
      setMessages([...chatMessages, newMessageReply]);
    }
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
        {speech ? (
          <video controls autoPlay src={speech} className="character-video">
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
                      src={message.sender === "Chat Bot" ? character.avatar : "https://picsum.photos/200"}
                      alt={message.sender === "Chat Bot" ? `${character.name} avatar` : "User avatar"}
                    />
                  </div>
                  <div className="chatBox-body-content-message-item-content">
                    {message.isLoading ? (
                      <div className="message-loading">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="loading-text">Đang soạn tin nhắn...</span>
                      </div>
                    ) : message.text === "video" ? (
                      <Video videoUrls={message.videoUrls} />
                    ) : (
                      <div className="message-content">
                        <p style={{ whiteSpace: "pre-line", margin: 0 }}>{message.text}</p>
                        {message.sender === "Chat Bot" && (
                          <div className="message-actions">
                            <button
                              className="action-button"
                              onClick={() => textToSpeech(message.text)}
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
          {/* <ToggleButton ref={inputRef} /> */}
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
      </div>
    </div>
  );
};

export default DaiVietChat;
