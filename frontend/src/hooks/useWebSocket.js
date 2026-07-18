import { useEffect, useRef, useCallback, useState } from 'react';

export function useWebSocket(roomId) {
  const stompRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const connect = useCallback(() => {
    if (stompRef.current?.connected) return;

    const loadStomp = () => {
      if (window.Stomp) {
        initStomp();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js';
      script.onload = () => initStomp();
      document.head.appendChild(script);
    };

    function initStomp() {
      const socket = new window.SockJS('/ws');
      const stomp = window.Stomp.over(socket);
      stomp.debug = null;

      stomp.connect({}, () => {
        setConnected(true);
        if (roomId) {
          stomp.subscribe(`/topic/chat/${roomId}`, (message) => {
            const event = JSON.parse(message.body);
            window.dispatchEvent(new CustomEvent('ws-message', { detail: event }));
          });
          stomp.subscribe(`/topic/chat/${roomId}/typing`, (message) => {
            const event = JSON.parse(message.body);
            if (event.isTyping) {
              setTypingUsers((prev) => new Set([...prev, event.userId]));
              setTimeout(() => {
                setTypingUsers((prev) => {
                  const next = new Set(prev);
                  next.delete(event.userId);
                  return next;
                });
              }, 3000);
            }
          });
          stomp.subscribe(`/topic/chat/${roomId}/read`, (message) => {
            const event = JSON.parse(message.body);
            window.dispatchEvent(new CustomEvent('ws-read', { detail: event }));
          });
        }
        stomp.subscribe('/topic/presence', (message) => {
          const event = JSON.parse(message.body);
          window.dispatchEvent(new CustomEvent('ws-presence', { detail: event }));
        });
      });

      stompRef.current = stomp;
    }

    loadStomp();
  }, [roomId]);

  const sendMessage = useCallback((chatRoomId, content) => {
    if (stompRef.current?.connected) {
      stompRef.current.send(`/app/chat/${chatRoomId}/send`, {}, JSON.stringify({ content }));
    }
  }, []);

  const sendTyping = useCallback((chatRoomId, userId, isTyping) => {
    if (stompRef.current?.connected) {
      stompRef.current.send(`/app/chat/${chatRoomId}/typing`, {}, JSON.stringify({ userId, isTyping }));
    }
  }, []);

  const sendReadReceipt = useCallback((chatRoomId, userId) => {
    if (stompRef.current?.connected) {
      stompRef.current.send(`/app/chat/${chatRoomId}/read`, {}, JSON.stringify({ userId }));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (stompRef.current?.connected) {
        stompRef.current.disconnect();
        setConnected(false);
      }
    };
  }, [connect]);

  return { connected, typingUsers, sendMessage, sendTyping, sendReadReceipt };
}
