'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Avatar,
  useTheme,
  Tooltip,
  useMediaQuery,
  Menu,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  Send as SendIcon,
  PhotoCamera,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import ReactMarkdown from 'react-markdown';
import { alpha } from '@mui/material/styles';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
  chat_id?: string;
}

interface Chat {
  id: string;
  title: string;
  updated_at: string;
  messages?: Message[];
}

interface MessageData {
  chat_id: string;
  sender: 'user' | 'assistant';
  content: string;
  image_url?: string;
}

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  [key: string]: string | undefined;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [chatOptionsAnchorEl, setChatOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChatForOptions, setSelectedChatForOptions] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const pendingMessagesRef = useRef<Message[]>([]);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const saveMessagesToLocalStorage = useCallback((chatId: string, msgs: Message[]) => {
    if (!chatId || msgs.length === 0) return;
    
    try {
      const key = `chat_messages_${chatId}`;
      localStorage.setItem(key, JSON.stringify(msgs));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, []);
  

  useEffect(() => {
    if (currentChat && messages.length > 0) {
      saveMessagesToLocalStorage(currentChat.id, messages);
    }
  }, [messages, currentChat, saveMessagesToLocalStorage]);

  const loadMessages = useCallback(async (chatId: string) => {
    try {      
      if (!chatId) {
        console.error('Invalid chat ID provided to loadMessages');
        return;
      }
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + (sessionError?.message || 'No session found'));
      }
      
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('id, user_id')
        .eq('id', chatId)
        .single();
        
      if (chatError) {
        console.error('Error checking chat:', chatError);
        throw chatError;
      }
      
      if (!chatData) {
        console.warn('Chat does not exist:', chatId);
        return;
      }
      
      if (chatData.user_id !== session.user.id) {
        console.error('Chat does not belong to current user');
        return;
      }
            
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }
      
      const mappedMessages = messagesData.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        timestamp: new Date(msg.created_at),
        image: msg.image_url,
        chat_id: msg.chat_id
      }));
      
      setMessages(mappedMessages);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
      setNotification({ 
        type: 'error', 
        message: 'Failed to load messages. Please try refreshing the page.' 
      });
    }
  }, [supabase, setNotification]);

  const loadChats = useCallback(async () => {
    try {
      const { data: chatsData, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setChats(chatsData);
      setFilteredChats(chatsData);
      
      setCurrentChat(currentChatValue => {
        if (chatsData.length > 0 && !currentChatValue) {
          return chatsData[0];
        } else if (currentChatValue) {
          const chatStillExists = chatsData.some(chat => chat.id === currentChatValue.id);
          if (!chatStillExists && chatsData.length > 0) {
            return chatsData[0];
          }
        }
        return currentChatValue;
      });
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }, [supabase]);

  const autoResizeTextField = useCallback(() => {
    const textarea = textFieldRef.current;
    if (textarea) {
      const lineHeight = 20; 
      const padding = 20; 
      const scrollHeight = textarea.scrollHeight - padding;
      
      if (scrollHeight <= lineHeight) {
        textarea.style.height = '40px';
      } else {
        const newHeight = Math.min(textarea.scrollHeight, isMobile ? 120 : 200);
        textarea.style.height = `${newHeight}px`;
      }
    }
  }, [isMobile]);

  useEffect(() => {
    autoResizeTextField();
  }, [newMessage, autoResizeTextField]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const adjustViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    adjustViewportHeight();
    window.addEventListener('resize', adjustViewportHeight);
    window.addEventListener('orientationchange', adjustViewportHeight);

    return () => {
      window.removeEventListener('resize', adjustViewportHeight);
      window.removeEventListener('orientationchange', adjustViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (currentChat && user) {
      loadMessages(currentChat.id);
    } else if (!currentChat) {
      setMessages([]);
    }
  }, [currentChat, loadMessages, user]);

  useEffect(() => {
    if (!isMobile) {
      setShowSidebar(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user, loadChats]);

  useEffect(() => {
    if (showSidebar && isMobile) {
      loadChats();
    }
  }, [showSidebar, isMobile, loadChats]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredChats(
        chats.filter(chat => 
          chat.title.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, chats]);

  const createNewChat = async () => {
    if (!user) {
      setNotification({ type: 'error', message: t('auth.signInPrompt') });
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }

    if (currentChat && messages.filter(msg => msg.chat_id === currentChat.id).length === 0) {
      setNotification({ 
        type: 'error', 
        message: 'Please add a message to your current chat before creating a new one.' 
      });
      return;
    }

    try {
      const { data: chat, error } = await supabase
        .from('chats')
        .insert([{ 
          user_id: user.id,
          title: 'New Chat'
        }])
        .select()
        .single();

      if (error) throw error;
      if (!chat) throw new Error('Failed to create new chat');

      setChats(prev => [chat, ...prev]);
      setCurrentChat(chat);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('Failed to create new chat. Please try again.');
    }
  };

  const validateMessageData = (messageData: MessageData): string | null => {
    if (!messageData.chat_id) {
      return 'Missing chat_id';
    }
    if (!messageData.sender) {
      return 'Missing sender';
    }
    if (messageData.sender !== 'user' && messageData.sender !== 'assistant') {
      return `Invalid sender: ${messageData.sender}. Must be 'user' or 'assistant'`;
    }
    if (messageData.content === undefined || messageData.content === null) {
      return 'Missing content';
    }
    return null; 
  };

  const isErrorMeaningful = (error: Error | SupabaseError | null | unknown): boolean => {
    if (!error) return false;
    
    if (error instanceof Error) {
      return true;
    }
    
    if (typeof error === 'object') {
      return Object.keys(error as object).length > 0 && 
             ((error as SupabaseError).code !== undefined || 
              (error as SupabaseError).message !== undefined || 
              (error as SupabaseError).details !== undefined);
    }
    
    return false;
  };

  const saveMessage = async (message: Message, chatId: string) => {
    try {
      
      if (!chatId) {
        throw new Error('Chat ID is undefined or empty');
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found. User may not be authenticated.');
      }
      
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('id, user_id')
        .eq('id', chatId)
        .single();
        
      if (isErrorMeaningful(chatError)) {
        console.error('Error verifying chat access:', chatError);
        const errorMessage = chatError && typeof chatError === 'object' && chatError.message 
          ? chatError.message 
          : 'Unknown error';
        throw new Error(`Cannot access chat with ID ${chatId}: ${errorMessage}`);
      }
      
      if (!chatData) {
        throw new Error(`Chat with ID ${chatId} not found`);
      }
      
      if (chatData.user_id !== session.user.id) {
        throw new Error(`User ${session.user.id} does not have permission to access chat ${chatId}`);
      }
      
      const messageData = {
        chat_id: chatId,
        sender: message.sender,
        content: message.text || '',
        image_url: message.image
      };
      
      const validationError = validateMessageData(messageData);
      if (validationError) {
        throw new Error(`Invalid message data: ${validationError}`);
      }
      
      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);
      
      if (error && error.code === '42501') {
        console.warn('Permission denied (RLS policy violation). This is likely due to RLS policies.');
        console.warn('The current RLS policy requires the user to own the chat.');
        

        return;
      } else if (isErrorMeaningful(error)) {
        console.error('Error inserting message:', error);
        throw error;
      }
            
      const { error: updateError } = await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);
        
      if (isErrorMeaningful(updateError)) {
        console.error('Error updating chat timestamp:', updateError);
        if (updateError && typeof updateError === 'object') {
          if (updateError.code) console.error('Update error code:', updateError.code);
          if (updateError.message) console.error('Update error message:', updateError.message);
        }
      }
    } catch (error) {
      if (isErrorMeaningful(error)) {
        console.error('Error in saveMessage function:', error);
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        } else {
          console.error('Unknown error type:', typeof error);
        }
        throw error; 
      } else {
        console.warn('Caught empty error object when saving message');
      }
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      handleSendMessage(undefined, file);
    }
  };

  const safelyUpdateMessages = useCallback((newMessage: Message) => {
    pendingMessagesRef.current = [...messages, newMessage];
    
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      return updatedMessages;
    });
  }, [messages]);
  
  const restorePendingMessages = useCallback(() => {
    if (pendingMessagesRef.current.length > 0 && 
        (messages.length === 0 || 
         pendingMessagesRef.current.length > messages.length)) {
      setMessages(pendingMessagesRef.current);
    }
  }, [messages]);
  
  useEffect(() => {
    if (isProcessingMessage && messages.length < pendingMessagesRef.current.length) {
      restorePendingMessages();
    }
  }, [messages, isProcessingMessage, restorePendingMessages]);

  const handleSendMessage = async (e?: React.FormEvent, imageFile?: File) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newMessage.trim() && !imageFile) return;

    if (!user) {
      setNotification({ type: 'error', message: t('auth.signInPrompt') });
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }

    setIsProcessingMessage(true);

    let chatId: string;
    let isNewChat = false;
    
    if (!currentChat) {
      try {
        const { data: chat, error } = await supabase
          .from('chats')
          .insert([{ 
            user_id: user.id,
            title: newMessage.slice(0, 50) + (newMessage.length > 50 ? '...' : '')
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating new chat:', error);
          throw error;
        }
        if (!chat) {
          console.error('No chat data returned after creation');
          throw new Error('Failed to create new chat');
        }

        chatId = chat.id;
        isNewChat = true;
        setChats(prev => [chat, ...prev]);
        setCurrentChat(chat);
      } catch (error) {
        console.error('Error creating chat:', error);
        setNotification({ type: 'error', message: 'Failed to create new chat. Please try again.' });
        return;
      }
    } else {
      chatId = currentChat.id;
    }

    if (!chatId) {
      console.error('Chat ID is undefined or empty');
      setNotification({ type: 'error', message: 'Invalid chat ID. Please try again.' });
      return;
    }

    const messageId = Date.now().toString();
    let imageUrl = '';

    const userMessage: Message = {
      id: messageId,
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      chat_id: chatId,
      ...(imageUrl && { image: imageUrl })
    };

    
    safelyUpdateMessages(userMessage);
    
    setNewMessage('');
    setIsLoading(true);

    try {
      await saveMessage(userMessage, chatId);
    } catch (error) {
      if (isErrorMeaningful(error)) {
        console.error('Failed to save user message:', error);
      } else {
        console.warn('Empty error object when saving user message');
      }
    }

    const sendRequest = async (retryCount = 0) => {
      try {
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          throw new Error('Authentication error: ' + (sessionError?.message || 'No session found'));
        }
        
        let response;
        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          formData.append('message', newMessage || '');
          formData.append('context', JSON.stringify(messages.slice(-5)));

          response = await fetch('/api/chat', {
            method: 'POST',
            body: formData
          });
        } else {
          response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: newMessage,
              context: messages.slice(-5)
            })
          });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          console.error('API response error:', errorData);
          
          if (response.status === 401 && retryCount < 2) {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              throw new Error('Failed to refresh session: ' + refreshError.message);
            }
            return sendRequest(retryCount + 1);
          }
          
          throw new Error(errorData.error || `Failed to get response: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !data.reply) {
          console.error('Invalid API response:', data);
          throw new Error('Invalid response from API');
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: 'assistant',
          timestamp: new Date(),
          chat_id: chatId
        };

        safelyUpdateMessages(assistantMessage);
        
        try {
          await saveMessage(assistantMessage, chatId);
        } catch (error) {
          if (isErrorMeaningful(error)) {
            console.error('Failed to save assistant message:', error);
          }
        }

        if (isNewChat && newMessage.trim()) {
          const title = newMessage.slice(0, 50) + (newMessage.length > 50 ? '...' : '');
          await supabase
            .from('chats')
            .update({ title })
            .eq('id', chatId);
            
          setChats(prev => prev.map(chat => 
            chat.id === chatId ? { ...chat, title } : chat
          ));
        }
      } catch (error) {
        console.error('Error in chat request:', error);
        safelyUpdateMessages({
          id: Date.now().toString(),
          text: error instanceof Error ? error.message : 'An error occurred while processing your message',
          sender: 'assistant',
          timestamp: new Date(),
          chat_id: chatId
        });
      } finally {
        setIsLoading(false);
        setIsProcessingMessage(false);
        if (selectedImage) {
          setSelectedImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }
    };

    await sendRequest();
  };

  const formatMessageTime = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return messageDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const TRANSLATION_KEYS = {
    chats: 'navigation.chat',
    newChat: 'recipe.create',
    typeMessage: 'common.typeMessage',
    send: 'common.send',
    scan: 'navigation.scan',
    save: 'common.save'
  } as const;

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      if (currentChat?.id === chatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChat(remainingChats[0]);
        } else {
          setCurrentChat(null);
        }
      }

      setChatOptionsAnchorEl(null);
      
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  const handleChatMenuClose = () => {
    setChatMenuAnchorEl(null);
  };

  const handleChatOptionsOpen = (event: React.MouseEvent<HTMLButtonElement>, chatId: string) => {
    setChatOptionsAnchorEl(event.currentTarget);
    setSelectedChatForOptions(chatId);
  };

  const handleChatOptionsClose = () => {
    setChatOptionsAnchorEl(null);
    setSelectedChatForOptions(null);
  };

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleSaveRecipe = async (message: Message) => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('You must be logged in to save recipes');
      }

      const mealInfo = extractMealInfo(message.text);
      
      if (!mealInfo) {
        throw new Error('Could not parse meal information');
      }


      const { data, error } = await supabase
        .from('meals')
        .insert([
          {
            user_id: user.id,
            title: mealInfo.title,
            description: mealInfo.description,
            type: 'dinner', 
            nutritional_info: mealInfo.nutritional_info,
            ingredients: mealInfo.ingredients,
            instructions: mealInfo.instructions,
            cooking_time: mealInfo.cooking_time,
            servings: mealInfo.servings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving meal:', error);
        throw error;
      }

      setNotification({ type: 'success', message: t('notifications.mealSaved') });
    } catch (error: unknown) {
      console.error('Error saving meal:', error);
      setNotification({ type: 'error', message: t('notifications.errorSavingMeal') });
    } finally {
      setIsLoading(false);
    }
  };

  const extractMealInfo = (text: string) => {
    interface Ingredient {
      name: string;
      amount: number;
      unit: string;
    }

    interface Instruction {
      text: string;
      duration: number | null;
      timer_required: boolean;
    }

    interface MealInfo {
      title: string;
      ingredients: Ingredient[];
      instructions: Instruction[];
      cooking_time: number;
      servings: number;
      description: string;
      nutritional_info: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
    }

    const ingredientsMatch = text.match(/ingredients:?[\s\S]*?(?=instructions:?|$)/i);
    const instructionsMatch = text.match(/instructions:?[\s\S]*?(?=(?:cooking time|$))/i);
    
    const ingredients: Ingredient[] = ingredientsMatch ? ingredientsMatch[0]
      .replace(/ingredients:?/i, '') 
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.toLowerCase().includes('ingredients'))
      .map(line => {
        const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
        if (!cleanLine) return null;

        const match = cleanLine.match(/^([0-9½¼¾⅓⅔]+(?:\/[0-9]+)?(?:\.[0-9]+)?(?:\s*-\s*[0-9]+)?)\s*([a-zA-Z]+)?\s*(.+)$/);
        
        if (match) {
          let amount = 1;
          try {
            const rawAmount = match[1]
              .replace('½', '0.5')
              .replace('¼', '0.25')
              .replace('¾', '0.75')
              .replace('⅓', '0.33')
              .replace('⅔', '0.67');
              
            if (rawAmount.includes('-')) {
              const [min, max] = rawAmount.split('-').map(n => parseFloat(n.trim()));
              amount = (min + max) / 2;
            } else {
              amount = rawAmount.includes('/') ? 
                eval(rawAmount) : 
                parseFloat(rawAmount);
            }
          } catch (e) {
            console.error('Error parsing ingredient amount:', e);
            amount = 1;
          }
          
          const ingredient: Ingredient = {
            name: match[3].trim(),
            amount: isNaN(amount) ? 1 : amount,
            unit: match[2]?.toLowerCase() || 'piece'
          };
          
          return ingredient.name ? ingredient : null;
        }
        
        const ingredient: Ingredient = {
          name: cleanLine,
          amount: 1,
          unit: 'piece'
        };
        
        return ingredient.name ? ingredient : null;
      })
      .filter((ing): ing is Ingredient => 
        ing !== null && typeof ing.name === 'string' && ing.name !== '*'
      ) : [];

    const instructions: Instruction[] = instructionsMatch ? instructionsMatch[0]
      .replace(/instructions:?/i, '') 
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.toLowerCase().includes('instructions'))
      .map(line => {
        const text = line.replace(/^(?:\d+\.\s*|[-•*]\s*)/, '').trim();
        if (!text) return null;
        
        const durationMatch = text.match(/(\d+)[\s-]*(minutes?|mins?|hours?)/i);
        const duration = durationMatch ? 
          (durationMatch[2].toLowerCase().startsWith('hour') ? 
            parseInt(durationMatch[1]) * 60 : 
            parseInt(durationMatch[1])) : 
          null;

        const instruction: Instruction = {
          text,
          duration: duration,
          timer_required: duration !== null
        };
        return instruction;
      })
      .filter((inst): inst is Instruction => inst !== null) : [];

    const titleMatch = text.match(/\*\*([^*]+)\*\*/) || 
                    text.match(/^([^\n]+)(?=\n+ingredients:)/i) || 
                    text.match(/^(?:\*\*)?([^*\n]+)(?:\*\*)?\s*$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'New Recipe';

    const timeMatch = text.match(/(?:cooking time|time):\s*(?:approximately\s*)?(\d+)\s*(?:minutes?|mins?|hours?)/i);
    const cookingTime = timeMatch ? 
      (timeMatch[0].toLowerCase().includes('hour') ? 
        parseInt(timeMatch[1]) * 60 : 
        parseInt(timeMatch[1])) : 
      30;

    const description = text
      .replace(/ingredients:[\s\S]*?(?=instructions:|$)/i, '')
      .replace(/instructions:[\s\S]*?(?=cooking time:|$)/i, '')
      .replace(/cooking time:.*$/i, '')
      .trim();

    if (ingredients.length > 0 && instructions.length > 0) {
      const mealInfo: MealInfo = {
        title,
        ingredients,
        instructions,
        cooking_time: cookingTime,
        servings: 4,
        description,
        nutritional_info: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      };
      return mealInfo;
    }
    return null;
  };

  return (
    <Box 
      sx={{ 
        height: '100dvh',
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#0A1929',
      }}
    >
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 24 } }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={notification?.type || 'info'}
          onClose={() => setNotification(null)}
          sx={{ display: notification ? 'flex' : 'none' }}
        >
          {notification?.message}
        </MuiAlert>
      </Snackbar>

      {(showSidebar || !isMobile) && (
        <Box
          sx={{
            width: isMobile ? '100%' : 300,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: theme.palette.mode === 'light' ? 
              alpha(theme.palette.background.paper, 0.8) : 
              alpha(theme.palette.background.paper, 0.8),
            display: 'flex',
            flexDirection: 'column',
            position: isMobile ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1100,
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              position: 'sticky',
              top: 0,
              bgcolor: theme.palette.mode === 'light' ? 
                alpha(theme.palette.background.paper, 0.95) : 
                alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(8px)',
              zIndex: 1200,
              minHeight: 64,
              boxShadow: `0 1px 2px ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={() => {
                    router.push('/');
                  }}
                  sx={{ mr: 2 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                
                <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
                  Chat
                </Typography>
              </Box>

              {!isMobile && (
                <Button
                  variant="contained"
                  onClick={createNewChat}
                  startIcon={<AddIcon />}
                  sx={{ 
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  New Chat
                </Button>
              )}
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              p: 2, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              position: 'sticky',
              top: 64,
              bgcolor: theme.palette.mode === 'light' ? 
                alpha(theme.palette.background.paper, 0.95) : 
                alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(8px)',
              zIndex: 9,
              boxShadow: `0 1px 2px ${alpha(theme.palette.divider, 0.05)}`,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'light' ? 
                    alpha(theme.palette.common.black, 0.03) : 
                    alpha(theme.palette.common.white, 0.03),
                }
              }}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Button
                fullWidth
                variant="contained"
                onClick={createNewChat}
                startIcon={<AddIcon />}
                sx={{ 
                  py: 1,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                New Chat
              </Button>
            </Box>
          )}
          
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              pt: 2,
              mt: 0,
              pb: 4,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.text.primary, 0.2),
                borderRadius: '3px',
              },
            }}
          >
            {filteredChats.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                {searchQuery ? 'No chats found' : 'No chats yet'}
              </Box>
            )}
            {filteredChats.map((chat) => (
              <Paper
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: currentChat?.id === chat.id ?
                    alpha(theme.palette.primary.main, 0.08) :
                    'transparent',
                  border: `1px solid ${alpha(
                    currentChat?.id === chat.id ?
                      theme.palette.primary.main :
                      theme.palette.divider,
                    0.1
                  )}`,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: currentChat?.id === chat.id ?
                      alpha(theme.palette.primary.main, 0.12) :
                      alpha(theme.palette.action.hover, 0.1),
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: currentChat?.id === chat.id ? 700 : 500,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '85%',
                      color: currentChat?.id === chat.id ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {chat.title}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleChatOptionsOpen(e, chat.id)}
                    sx={{ 
                      p: 0.5, 
                      ml: 'auto',
                      opacity: 0.6,
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  {new Date(chat.updated_at).toLocaleDateString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          visibility: (isMobile && showSidebar) ? 'hidden' : 'visible',
          pt: '56px', 
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: isMobile ? 2 : 4,
            py: 2,
            bgcolor: theme.palette.mode === 'light' ? 
              alpha(theme.palette.background.paper, 0.8) : 
              alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            minHeight: isMobile ? 56 : 64,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IconButton 
              onClick={() => {
                setShowSidebar(true);
                loadChats();
              }}
              sx={{ 
                color: 'text.primary',
                mr: 2,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography 
              variant="h6" 
              component="h1"
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                flex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Chat Assistant
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ height: 16 }} />
        
        <Menu
          anchorEl={chatMenuAnchorEl}
          open={Boolean(chatMenuAnchorEl)}
          onClose={handleChatMenuClose}
          PaperProps={{
            sx: {
              width: 280,
              maxHeight: 400,
            }
          }}
        >
          <MenuItem 
            onClick={() => {
              createNewChat();
              handleChatMenuClose();
            }}
            sx={{ 
              color: 'primary.main',
              fontWeight: 500,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              py: 1.5,
            }}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            New Chat
          </MenuItem>
          
          {chats.length === 0 ? (
            <MenuItem disabled sx={{ color: 'text.secondary', py: 2, justifyContent: 'center' }}>
              No recent chats
            </MenuItem>
          ) : (
            chats.slice(0, 10).map((chat) => (
              <MenuItem 
                key={chat.id}
                onClick={() => {
                  handleChatSelect(chat);
                  handleChatMenuClose();
                }}
                selected={currentChat?.id === chat.id}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.25,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '100%',
                  overflow: 'hidden',
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: currentChat?.id === chat.id ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      mt: 0.5,
                    }}
                  >
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
          
          {chats.length > 10 && (
            <MenuItem 
              onClick={() => {
                handleChatMenuClose();
                setShowSidebar(true);
                loadChats();
              }}
              sx={{ 
                justifyContent: 'center', 
                color: 'primary.main',
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                py: 1.5,
              }}
            >
              View all chats
            </MenuItem>
          )}
        </Menu>
        
        <Box 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            px: isMobile ? 2 : 4,
            py: 3,
            pt: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: `${alpha(theme.palette.text.primary, 0.2)} transparent`,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.text.primary, 0.2),
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: alpha(theme.palette.text.primary, 0.3),
            },
          }}
        >
          {messages.length === 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                opacity: 0.7,
                gap: 2,
                py: 4
              }}
            >
              <BotIcon sx={{ fontSize: 48, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                Start a new conversation
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
                Type a message below to start chatting. Ask me anything about cooking, recipes, or ingredients. I can help you plan meals, suggest recipes, and more.
              </Typography>
            </Box>
          )}
          {messages.map((message) => {
            
            const safeSender = message.sender === 'user' ? 'user' : 'assistant';
            
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: safeSender === 'user' ? 'row-reverse' : 'row',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  maxWidth: '100%',
                  mb: 2,
                  px: isMobile ? 0 : 2,
                }}
              >
                <Avatar
                  src={safeSender === 'user' && user?.user_metadata?.avatar_url ? user.user_metadata.avatar_url : undefined}
                  sx={{
                    bgcolor: safeSender === 'user' ? 
                      alpha(theme.palette.primary.main, 0.9) : 
                      alpha(theme.palette.secondary.main, 0.9),
                    width: 32,
                    height: 32,
                    display: isTablet ? 'none' : 'flex',
                    flexShrink: 0,
                  }}
                >
                  {safeSender === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: isMobile ? '85%' : '70%',
                    bgcolor: safeSender === 'user' ? 
                      alpha(theme.palette.primary.main, 0.08) : 
                      alpha(theme.palette.background.paper, 0.8),
                    color: theme.palette.text.primary,
                    borderRadius: 2,
                    position: 'relative',
                    wordBreak: 'break-word',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(
                      safeSender === 'user' ? 
                        theme.palette.primary.main : 
                        theme.palette.divider,
                      0.1
                    )}`,
                    opacity: 1,
                    visibility: 'visible',
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      marginTop: 1,
                      marginBottom: 1,
                    },
                    '& pre': {
                      maxWidth: '100%',
                      overflow: 'auto',
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.action.hover, 0.8),
                      WebkitOverflowScrolling: 'touch',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    },
                    '& code': {
                      fontFamily: 'monospace',
                      bgcolor: alpha(theme.palette.action.hover, 0.8),
                      p: 0.5,
                      borderRadius: 0.5,
                      fontSize: '0.875rem',
                    },
                    '& p': {
                      lineHeight: 1.6,
                      margin: '0.5em 0',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1,
                  }}>
                    {message.image && (
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          minHeight: '200px',
                          maxHeight: '300px',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          borderRadius: 1,
                          overflow: 'hidden',
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            zIndex: 1,
                          }}
                          id={`loading-${message.id}`}
                        >
                          <CircularProgress size={24} />
                        </Box>
                        
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={message.image}
                          alt="Uploaded content"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            zIndex: 2,
                          }}
                          onLoad={() => {
                            const loadingIndicator = document.getElementById(`loading-${message.id}`);
                            if (loadingIndicator) {
                              loadingIndicator.style.display = 'none';
                            }
                          }}
                          onError={(e) => {
                            console.error('Error loading image:', message.image);
                            
                            const imageUrl = message.image || '';
                            const supabaseUrlPattern = /^https:\/\/vjfsascagdencbewveoz\.supabase\.co\/storage\/v1\/object\/public\//;
                            if (!supabaseUrlPattern.test(imageUrl)) {
                              console.error('URL does not match the pattern in next.config.ts:', imageUrl);
                            }
                            
                            const loadingIndicator = document.getElementById(`loading-${message.id}`);
                            if (loadingIndicator) {
                              loadingIndicator.style.display = 'none';
                            }
                            
                            const imgElement = e.target as HTMLImageElement;
                            const parent = imgElement.parentElement;
                            if (parent) {
                              const errorElement = document.createElement('div');
                              errorElement.style.cssText = `
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                width: 100%;
                                height: 100%;
                                padding: 20px;
                                text-align: center;
                                color: #666;
                                z-index: 2;
                              `;
                              errorElement.innerHTML = `
                                <span style="font-size: 24px; margin-bottom: 8px;">❌</span>
                                <span>Image failed to load</span>
                                <span style="font-size: 10px; margin-top: 4px; opacity: 0.7;">
                                  ${imageUrl.substring(0, 50)}${imageUrl.length > 50 ? '...' : ''}
                                </span>
                              `;
                              parent.appendChild(errorElement);
                            }
                          }}
                        />
                      </Box>
                    )}
                    {message.text && (
                      <Box sx={{ width: '100%' }}>
                        <ReactMarkdown>{message.text || ''}</ReactMarkdown>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 1,
                    mt: 1
                  }}>
                    {safeSender === 'assistant' && (function() {
                      const mealInfo = extractMealInfo(message.text);
                      
                      const hasValidContent = mealInfo !== null;

                      return hasValidContent ? (
                        <Tooltip title="Add to my meals" placement="top">
                          <IconButton
                            size={isMobile ? "small" : "medium"}
                            onClick={async () => {
                              try {
                                const formattedIngredients = mealInfo.ingredients.map(ing => ({
                                  name: ing.name,
                                  amount: typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount) || 1,
                                  unit: ing.unit || 'piece'
                                }));

                                const formattedInstructions = mealInfo.instructions.map(inst => ({
                                  text: inst.text,
                                  duration: inst.duration || null,
                                  timer_required: inst.timer_required || false
                                }));

                                await handleSaveRecipe(message);
                              } catch (error: unknown) {
                                console.error('Error saving meal:', error);
                                setNotification({ type: 'error', message: t('notifications.errorSavingMeal') });
                              }
                            }}
                            sx={{
                              opacity: 0.8,
                              backgroundColor: theme.palette.mode === 'light' ? 
                                alpha(theme.palette.primary.main, 0.08) : 
                                alpha(theme.palette.primary.main, 0.15),
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              color: theme.palette.primary.main,
                              transition: 'all 0.2s ease',
                              '&:hover': { 
                                opacity: 1,
                                backgroundColor: theme.palette.mode === 'light' ? 
                                  alpha(theme.palette.primary.main, 0.12) : 
                                  alpha(theme.palette.primary.main, 0.25),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                              },
                              '&:active': {
                                transform: 'translateY(0)'
                              },
                              ml: 1,
                              flexShrink: 0,
                              backdropFilter: 'blur(8px)'
                            }}
                          >
                            <AddIcon 
                              fontSize={isMobile ? "small" : "medium"}
                              sx={{ 
                                transition: 'transform 0.2s ease',
                                '& > *': { strokeWidth: 2 }
                              }} 
                            />
                          </IconButton>
                        </Tooltip>
                      ) : null;
                    })()}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      right: safeSender === 'user' ? 'auto' : 8,
                      left: safeSender === 'user' ? 8 : 'auto',
                      color: alpha(theme.palette.text.secondary, 0.8),
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                    }}
                  >
                    {formatMessageTime(message.timestamp)}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            display: 'flex',
            gap: 1.5,
            bgcolor: theme.palette.mode === 'light' ? 
              alpha(theme.palette.background.paper, 0.8) : 
              alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'sticky',
            bottom: 0,
            width: '100%',
            zIndex: 1100,
            transition: 'all 0.3s ease',
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <Tooltip title={t(TRANSLATION_KEYS.scan)} placement="top">
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || !user}
              sx={{ 
                p: 1,
                height: 40,
                width: 40,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'light' ? 
                  alpha(theme.palette.primary.main, 0.08) : 
                  alpha(theme.palette.primary.main, 0.15),
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? 
                    alpha(theme.palette.primary.main, 0.12) : 
                    alpha(theme.palette.primary.main, 0.25),
                },
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Tooltip>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            variant="outlined"
            placeholder={t(TRANSLATION_KEYS.typeMessage)}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              autoResizeTextField();
            }}
            disabled={isLoading || !user}
            inputRef={textFieldRef}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.9375rem',
                bgcolor: theme.palette.mode === 'light' ? 
                  alpha(theme.palette.common.black, 0.03) : 
                  alpha(theme.palette.common.white, 0.03),
                transition: 'all 0.2s ease',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: '40px',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? 
                    alpha(theme.palette.common.black, 0.04) : 
                    alpha(theme.palette.common.white, 0.04),
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&.Mui-focused': {
                  bgcolor: theme.palette.background.paper,
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
              '& .MuiOutlinedInput-input': {
                padding: '8px 14px',
                lineHeight: '24px',
                '&::placeholder': {
                  color: alpha(theme.palette.text.primary, 0.4),
                  opacity: 1,
                },
              },
              '& textarea': {
                height: '24px !important',
                overflow: 'hidden',
                '&[rows="1"]': {
                  height: '24px !important',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />
          <Tooltip title={t(TRANSLATION_KEYS.send)} placement="top">
            <span>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || (!newMessage.trim() && !selectedImage) || !user}
                sx={{
                  minWidth: 'unset',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {isMobile && !showSidebar && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80, 
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 1200,
          }}
        >
          <Tooltip title="Show all chats" placement="left">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowSidebar(true);
                loadChats();
              }}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                boxShadow: theme.shadows[3],
                minWidth: 'unset',
                p: 0,
                '&:hover': {
                  boxShadow: theme.shadows[5],
                },
                bgcolor: alpha(theme.palette.secondary.main, 0.9),
              }}
            >
              <ListIcon fontSize="small" />
            </Button>
          </Tooltip>
          
          <Tooltip title="New chat" placement="left">
            <Button
              variant="contained"
              color="primary"
              onClick={createNewChat}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                boxShadow: theme.shadows[4],
                minWidth: 'unset',
                p: 0,
                '&:hover': {
                  boxShadow: theme.shadows[6],
                },
                bgcolor: alpha(theme.palette.primary.main, 0.9),
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Box>
      )}

      <Menu
        anchorEl={chatOptionsAnchorEl}
        open={Boolean(chatOptionsAnchorEl)}
        onClose={handleChatOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => {
            if (selectedChatForOptions) {
              deleteChat(selectedChatForOptions);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Chat
        </MenuItem>
      </Menu>
    </Box>
  );
} 