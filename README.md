# Cortex AI - Privacy-First Local AI Assistant

An application inspired by the [Jan AI](https://jan.ai) application - an open-source alternative to ChatGPT that runs 100% offline on your device. This version uses a secure Python backend to connect to the Google Gemini API for real-time AI responses.

![Cortex AI](https://img.shields.io/badge/Cortex_AI-Clone-orange?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

## 🔥 Features

### Core Chat Interface
- **ChatGPT-like conversation UI** with Cortex branding and flame logo
- **Real-time AI responses** powered by Google Gemini
- **Message history** with user and assistant avatars
- **Chat actions**: Copy, thumbs up/down, regenerate response
- **Privacy-first messaging** with a secure backend proxy for API key management

### Model Hub
- **Browse Models**: View available Cortex, Local, and Cloud models.
- **Simulated Downloads**: UI demonstrates model downloading and installation states.
- **Model Selection**: Choose the active model for conversations.

### Comprehensive Settings
- **General**: Theme selection (Light/Dark/Auto), language, default model.
- **Privacy & API**: Manage privacy settings and enter API keys (UI only).
- **Advanced**: Configure a local API server (UI only).

### Design Excellence
- **Authentic UI**: Faithfully reproduces the Jan AI look and feel.
- **Modern Components**: Built with a clean, component-based architecture.
- **Responsive Layout**: Features a collapsible sidebar for different screen sizes.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: Google Gemini API via `google-generativeai`
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.9

### Backend Setup
**1. Navigate to the backend directory:**
```bash
cd backend
```
**2. Create and activate a virtual environment:**
```bash
# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
venv\Scripts\activate
```
**3. Install dependencies:**
```bash
pip install -r requirements.txt
```
**4. Configure your API Key:**
   - Rename the `.env.example` file to `.env`.
   - Open the `.env` file and add your Google Gemini API key:
     ```env
     API_KEY="YOUR_GEMINI_API_KEY_HERE"
     ```
**5. Run the server:**
```bash
uvicorn main:app --reload
```
The backend server will now be running at `http://localhost:8000`.

### Frontend Setup
The frontend is configured to run in a web-based development environment and uses a CDN for its dependencies, so no `npm install` is required. It will automatically connect to the backend server running on `localhost:8000`.

## 🎯 Project Structure

```
.
├── backend/
│   ├── .env.example
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── layout/
│   │   │   ├── modelhub/
│   │   │   ├── settings/
│   │   │   └── ui/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── index.html
│   └── metadata.json
└── README.md
```

## 🛣️ Roadmap

- [ ] Database integration for conversations and settings
- [ ] Implement actual model downloading and management
- [ ] Real-time model switching in the backend
- [ ] Export/import conversation history

## 🙏 Acknowledgements

- [Jan AI](https://jan.ai) - Original application inspiration
- [shadcn/ui](https://ui.shadcn.com/) - Inspiration for UI components
- [Lucide React](https://lucide.dev/) - Clean, consistent icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework