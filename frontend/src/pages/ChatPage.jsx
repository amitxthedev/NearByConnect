import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, MessageCircle, Pin, MoreVertical, ChevronLeft, Send, Smile, Lock, Plus, X, Hash, UserPlus, Loader2 } from 'lucide-react';
import { chatApi, userApi, communityApi } from '../services/api';
import { timeAgo } from '../utils/format';
import useAppStore from '../stores/useAppStore';
import Avatar from '../components/ui/Avatar';
import SEO from '../components/seo/SEO';

const MessageBubble = ({ message, isMe }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 30 }}
    className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
  >
    <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2.5 max-w-[75%]`}>
      {!isMe && (
        <div className="w-9 h-9 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
              {message.senderName?.[0] || '?'}
            </div>
          )}
        </div>
      )}
      <div>
        {!isMe && (
          <span className="text-xs text-gray-500 ml-1 mb-1 block font-medium">{message.senderName}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isMe
              ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-lg shadow-sm'
              : 'bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-100'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className={`text-[10px] text-gray-400 mt-1 block ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
          {timeAgo(message.createdAt)}
        </span>
      </div>
    </div>
  </motion.div>
);

function NewChatModal({ isOpen, onClose, onRoomCreated }) {
  const [tab, setTab] = useState('communities');
  const [userSearch, setUserSearch] = useState('');
  const queryClient = useQueryClient();

  const user = useAppStore((s) => s.user);

  const { data: communitiesData, isLoading: commLoading } = useQuery({
    queryKey: ['myCommunitiesForChat'],
    queryFn: async () => {
      if (!user?.city?.id) return [];
      const res = await communityApi.getByCity(user.city.id);
      return (res.data?.content || []).filter(c => c.isMember);
    },
    enabled: !!user?.city?.id && tab === 'communities',
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['userSearch', userSearch],
    queryFn: async () => {
      const res = await userApi.search(userSearch);
      return (res.data?.content || res.data || []).filter(u => u.id !== user?.id);
    },
    enabled: tab === 'dm' && userSearch.trim().length >= 2,
  });

  const createCommunityRoomMutation = useMutation({
    mutationFn: (communityId) => chatApi.createCommunityRoom(communityId),
    onSuccess: (res) => {
      const room = res.data;
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      onRoomCreated(room.id);
      onClose();
    },
  });

  const createDmMutation = useMutation({
    mutationFn: (userId) => chatApi.getOrCreatePrivate(userId),
    onSuccess: (res) => {
      const room = res.data;
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      onRoomCreated(room.id);
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Start a Chat</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab('communities')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              tab === 'communities' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Hash className="w-4 h-4" />
            Community Chats
          </button>
          <button
            onClick={() => setTab('dm')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              tab === 'dm' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Direct Message
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {tab === 'communities' ? (
            <div className="p-3">
              {commLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : communitiesData?.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Hash className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">No communities yet</p>
                  <p className="text-xs text-gray-400 mb-4">Join a community to start chatting</p>
                  <Link
                    to="/communities"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white text-xs font-semibold rounded-xl hover:bg-pink-600 transition-colors"
                  >
                    Browse Communities
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {communitiesData?.map((community) => (
                    <button
                      key={community.id}
                      onClick={() => createCommunityRoomMutation.mutate(community.id)}
                      disabled={createCommunityRoomMutation.isPending}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                        {community.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{community.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {community.memberCount || 0} members
                        </p>
                      </div>
                      <div className="shrink-0">
                        {createCommunityRoomMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                        ) : (
                          <MessageCircle className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by username..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 transition-all"
                />
              </div>
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : usersData?.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-sm text-gray-400">
                    {userSearch.trim().length < 2 ? 'Type at least 2 characters to search' : 'No users found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {usersData?.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => createDmMutation.mutate(u.id)}
                      disabled={createDmMutation.isPending}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="shrink-0">
                        <Avatar name={u.anonymousName} size="md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{u.anonymousName}</p>
                        <p className="text-xs text-gray-400">{u.city?.name || 'Unknown city'}</p>
                      </div>
                      <div className="shrink-0">
                        {createDmMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                        ) : (
                          <Send className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChatPage() {
  const { roomId } = useParams();
  const [selectedRoomId, setSelectedRoomId] = useState(roomId ? Number(roomId) : null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(!!roomId);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  const user = useAppStore((s) => s.user);
  const currentUserId = user?.id;

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatApi.getRooms().then((r) => r.data),
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', selectedRoomId],
    queryFn: () => chatApi.getMessages(selectedRoomId).then((r) => r.data),
    enabled: !!selectedRoomId,
  });

  const rawMessages = messagesData?.content || messagesData;
  const currentMessages = Array.isArray(rawMessages) ? rawMessages : [];

  const sendMessageMutation = useMutation({
    mutationFn: (data) => chatApi.sendMessage(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', selectedRoomId] });
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, selectedRoomId]);

  useEffect(() => {
    if (roomId) {
      setSelectedRoomId(Number(roomId));
      setMobileShowChat(true);
    }
  }, [roomId]);

  const handleSend = () => {
    if (!messageInput.trim() || !selectedRoomId) return;
    sendMessageMutation.mutate({
      chatRoomId: selectedRoomId,
      content: messageInput.trim(),
    });
    setMessageInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e) => {
    setMessageInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleRoomCreated = (roomId) => {
    setSelectedRoomId(roomId);
    setMobileShowChat(true);
  };

  const filteredRooms = rooms.filter((room) =>
    room.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRoom = rooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="flex h-[calc(100dvh-136px)] md:h-[calc(100dvh-80px)] bg-gray-50">
      <SEO
        title="Chat"
        description="Anonymous real-time chat with your local community members. Send messages, share ideas, and connect privately."
        path="/chat"
        index={false}
      />
      {/* Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
                <MessageCircle className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewChat(true)}
                className="p-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors shadow-sm shadow-pink-200"
                title="Start new chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 transition-all"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No conversations yet</p>
              <p className="text-xs text-gray-400 mb-4">Start a chat with your community or a friend</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white text-xs font-semibold rounded-xl hover:bg-pink-600 transition-colors shadow-sm shadow-pink-200"
              >
                <Plus className="w-3.5 h-3.5" />
                New Chat
              </button>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <motion.button
                key={room.id}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setMobileShowChat(true);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all text-left ${
                  selectedRoomId === room.id ? 'bg-pink-50/50 border-r-2 border-pink-500' : ''
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {room.name?.charAt(0) || 'C'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm truncate ${(room.unreadCount || 0) > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {room.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {room.lastMessage?.createdAt ? timeAgo(room.lastMessage.createdAt) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate ${(room.unreadCount || 0) > 0 ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                      {room.lastMessage?.content || 'No messages yet'}
                    </p>
                    {(room.unreadCount || 0) > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                  {room.memberCount != null && (
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-gray-300" />
                      <span className="text-[10px] text-gray-400">
                        {room.memberCount} members
                      </span>
                    </div>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${mobileShowChat ? 'flex' : 'hidden md:flex'}`}
      >
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {currentRoom.name?.charAt(0) || 'C'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">{currentRoom.name}</h2>
                  <p className="text-xs text-gray-400">
                    {currentRoom.memberCount != null ? `${currentRoom.memberCount} members` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Pin className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-gray-50 to-white">
              <div className="text-center mb-6">
                <span className="text-[11px] font-medium text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                  Today
                </span>
              </div>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-7 h-7 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <MessageCircle className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">No messages yet</p>
                  <p className="text-xs text-gray-400">Start the conversation!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {currentMessages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isMe={msg.senderId === currentUserId}
                    />
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-100 p-4">
              <div className="flex items-end gap-2.5">
                <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors flex-shrink-0">
                  <Smile className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white border border-gray-100 max-h-[120px] transition-all"
                  />
                </div>
                <motion.button
                  onClick={handleSend}
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  className={`p-2.5 rounded-xl flex-shrink-0 transition-all ${
                    messageInput.trim() && !sendMessageMutation.isPending
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  whileHover={messageInput.trim() ? { scale: 1.05 } : {}}
                  whileTap={messageInput.trim() ? { scale: 0.95 } : {}}
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <Lock className="w-3 h-3 text-gray-300" />
                <p className="text-[10px] text-gray-400">Messages are end-to-end encrypted</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <MessageCircle className="w-9 h-9 text-pink-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Select a conversation</h3>
              <p className="text-sm text-gray-400 mt-1.5 max-w-xs mb-5">Choose from your existing chats or start a new one</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <NewChatModal
            isOpen={showNewChat}
            onClose={() => setShowNewChat(false)}
            onRoomCreated={handleRoomCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
