# 🤖 Local LLM Chatbot

> **A powerful, privacy-focused conversational AI platform designed to run LLMs entirely on your local machine using Ollama, React, and FastAPI.**

## 🌟 About the Project

**Local LLM Chatbot** is a cutting-edge, fast, and privacy-centric conversational AI platform designed to run seamlessly on your local hardware. In an era where data privacy is paramount, this application empowers users to leverage the power of state-of-the-art open-source Large Language Models (LLMs)—such as Llama 3, Mistral, and Gemma—without relying on third-party cloud services or sacrificing data sovereignty. By utilizing **Ollama** for efficient local inference, the system ensures that every query, prompt, and generated response stays strictly within your machine, offering complete privacy and offline capability.

This project goes beyond a simple chat interface; it is a full-stack, production-ready template for building local AI applications. It helps you solve complex challenges like real-time data streaming, state management, and secure database integration. Whether for coding assistance, creative writing, or document analysis, the Local LLM Chatbot provides a robust, extensible, and completely private solution for your AI needs, putting the control of artificial intelligence back into the hands of the user.

### Key Capabilities
The application leverages a modern, high-performance technology stack to deliver a seamless user experience. The **frontend** is built with **React** and **Vite**, featuring a polished, responsive interface that rivals premium commercial tools. It supports real-time streaming of responses (simulating the speed of online services), syntax highlighting for code blocks, and an intuitive chat history management system. The design focuses on aesthetics and usability, providing a clean, distraction-free environment for interacting with AI.

On the **backend**, **FastAPI** drives the application with industry-leading speed and asynchronous capabilities. It orchestrates communication between the frontend and the local Ollama instance while managing data persistence through **MongoDB**. This allows users to save, retrieve, and manage their conversation history effortlessly. Secure user management adds another layer of security using **Firebase Authentication**, enabling a multi-user environment where individual histories are kept private and isolated.

With dynamic model switching, users can choose the best model for their specific task—using a larger model for complex reasoning or a smaller, faster model for quick queries. The architecture is modular and container-ready, making it easy to deploy or extend with additional features like RAG (Retrieval-Augmented Generation) or voice interfaces in the future.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup with Firebase Authentication
- 💬 **Real-time Streaming** - Stream responses from local LLM models in real-time
- 📝 **Persistent Chat History** - All conversations are saved to MongoDB per user
- 🎨 **Modern UI** - Beautiful, responsive interface with smooth animations
- 🔄 **Session Management** - Create, load, and delete chat sessions
- 🤖 **Multiple Models** - Support for multiple Ollama models with easy switching
- 🌐 **Fully Local** - LLM inference runs completely on your machine
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework:** React 18 with Vite for fast development
- **Authentication:** Firebase Auth for secure user management
- **Styling:** Custom CSS with modern design principles
- **State Management:** React Hooks (useState, useEffect)
- **Components:**
  - `ChatWindow` - Displays conversation history
  - `MessageInput` - User input with send functionality
  - `Sidebar` - Session history and navigation
  - `Login` - Authentication interface

### Backend (FastAPI + Python)
- **Framework:** FastAPI for high-performance async API
- **LLM Integration:** Ollama Python SDK for local model inference
- **Database:** MongoDB for user sessions and chat history
- **Authentication:** Firebase Admin (client-side verification)
- **API Endpoints:**
  - `POST /api/chat` - Send messages and get streaming responses
  - `POST /api/chat/new` - Create new chat session
  - `GET /api/models` - List available Ollama models
  - `GET /api/history/{user_id}` - Fetch user's chat sessions
  - `GET /api/history/{user_id}/{session_id}` - Load specific session
  - `DELETE /api/history/{user_id}/{session_id}` - Delete a session

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm
- **Ollama** installed and running ([Download Ollama](https://ollama.ai))
- **MongoDB** account (free tier available at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Firebase** project ([Firebase Console](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd localLLM
   ```

2. **Set up Python environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # Linux/Mac
   pip install fastapi uvicorn ollama pymongo python-dotenv
   ```

3. **Install Ollama models**
   ```bash
   ollama pull llama3.2
   # Or any other model you prefer
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=chatbot_localllm
   ```

5. **Set up Firebase**
   
   Create `chatbot-ui/src/firebase-config.js`:
   ```javascript
   export const firebaseConfig = {
     apiKey: "your_api_key",
     authDomain: "your_auth_domain",
     projectId: "your_project_id",
     storageBucket: "your_storage_bucket",
     messagingSenderId: "your_sender_id",
     appId: "your_app_id"
   };
   ```

6. **Install frontend dependencies**
   ```bash
   cd chatbot-ui
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   # From the root directory
   python -m uvicorn server:app --reload
   ```
   Backend runs on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   # From chatbot-ui directory
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

1. **Sign Up/Login** - Create an account or login with existing credentials
2. **Select a Model** - Choose from available Ollama models in the dropdown
3. **Start Chatting** - Type your message and press Enter or click Send
4. **Manage Sessions:**
   - Click "New Chat" to start a fresh conversation
   - Click on past sessions in the sidebar to load them
   - Sessions are automatically saved with your first message
5. **Logout** - Click the logout button in the header when done

## 🛠️ Technology Stack

### Frontend
- React 18.3.1
- Vite 5.4.1
- Firebase 12.9.0
- CSS3 with modern animations

### Backend
- FastAPI
- Uvicorn (ASGI server)
- Ollama Python SDK
- PyMongo
- Python-dotenv

### Database & Services
- MongoDB Atlas (Cloud database)
- Firebase Authentication
- Ollama (Local LLM runtime)

## 📁 Project Structure

```
localLLM/
├── chatbot-ui/                 # Frontend React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/              # Page components
│   │   │   └── Login.jsx
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # App styles
│   │   ├── firebase-config.js  # Firebase configuration
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
├── server.py                   # FastAPI backend server
├── .env                        # Environment variables
├── .gitignore
└── README.md
```

## 🔒 Security Notes

- Never commit `.env` or `firebase-config.js` with real credentials to version control
- Add them to `.gitignore`
- Use environment variables for sensitive data
- MongoDB credentials should use strong passwords
- Firebase security rules should be properly configured

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - Local LLM runtime
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Firebase](https://firebase.google.com/) - Authentication service
- [MongoDB](https://www.mongodb.com/) - Database platform
- [React](https://react.dev/) - Frontend framework

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ by developers, for developers
