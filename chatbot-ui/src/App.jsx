import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import './App.css'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import { firebaseConfig } from './firebase-config'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your local AI assistant. How can I help you today?' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch models
    fetch('http://localhost:8000/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.models)
        if (data.models.length > 0) {
          const defaultModel = data.models.find(m => m.includes('llama3.2')) || data.models[0];
          setSelectedModel(defaultModel)
        }
      })
      .catch(err => {
        console.error("Failed to fetch models", err);
        setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not connect to backend. Is the server running?" }]);
      })

    // Fetch history
    fetchHistory();
  }, [user])

  const fetchHistory = () => {
    if (!user) return;
    fetch(`http://localhost:8000/api/history/${user.uid}`)
      .then(res => res.json())
      .then(data => setSessions(data.sessions))
      .catch(err => console.error("Failed to fetch history", err));
  }

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{ role: 'assistant', content: 'Hello! I am your local AI assistant. How can I help you today?' }]);
  }

  const loadSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setIsLoading(true);
    fetch(`http://localhost:8000/api/history/${user.uid}/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load session", err);
        setIsLoading(false);
      });
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return

    if (!selectedModel) {
      setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: "Error: No model selected. Please ensure Ollama is running." }])
      return
    }

    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Create session if not exists
      let sessionId = currentSessionId;
      if (!sessionId) {
        const sessionRes = await fetch('http://localhost:8000/api/chat/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: text.substring(0, 30) || "New Chat",
            user_id: user.uid
          })
        });
        const sessionData = await sessionRes.json();
        sessionId = sessionData.session_id;
        setCurrentSessionId(sessionId);
        fetchHistory(); // Refresh sidebar
      }

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMessage],
          session_id: sessionId,
          user_id: user.uid
        })
      })

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.content += chunk;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the backend." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessages([{ role: 'assistant', content: 'Hello! I am your local AI assistant. How can I help you today?' }]);
      setSessions([]);
      setCurrentSessionId(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={(user) => setUser(user)} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={loadSession}
        onNewChat={startNewChat}
      />
      <div className="main-content">
        <header className="app-header">
          <h1>Ollama Chat</h1>
          <div className="header-right">
            <div className="model-selector">
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={models.length === 0}>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            <div className="user-info">
              <span className="user-email">{user.email || user.displayName}</span>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <main className="chat-container">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </main>
        <footer className="input-container">
          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  )
}

export default App
