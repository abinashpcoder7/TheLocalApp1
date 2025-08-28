
# Cortex AI - Privacy-First Local AI Assistant

An application inspired by the Jan.ai application - an open-source alternative to ChatGPT that runs 100% offline on your device.

![Cortex AI](https://img.shields.io/badge/Cortex_AI-Inspired-orange?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

## 🔥 Features

### Core Chat Interface
- **ChatGPT-like conversation UI** with Cortex branding and flame logo
- **Real-time AI responses** with typing indicators
- **Message history** with user and assistant avatars
- **Chat actions**: Copy, thumbs up/down, regenerate response
- **Privacy-first messaging** emphasizing local AI capabilities

### Model Hub
- **Cortex Models**: Custom models (Cortex-v1, Cortex-Nano, Lucy)
- **Local Models**: Open source models (Llama, Mistral, Qwen, Gemma)
- **Cloud Models**: Cloud providers (GPT-4, Claude, Gemini)
- **Model management**: Download, install, activate models
- **Rating system** and download statistics

### Comprehensive Settings
- **General**: Theme selection, language, default model
- **Privacy**: Local mode toggle, telemetry controls  
- **Models**: Download path, auto-updates, concurrent downloads
- **API Keys**: Secure cloud provider credential management
- **Advanced**: Local API server configuration

### Design Excellence
- **Cortex branding**: Flame logo, orange accent colors
- **Modern UI**: Clean, minimalist design
- **Status indicators**: Local Mode, API Ready badges
- **Responsive layout** with collapsible sidebar

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini API via `@google/genai`
- **Icons**: Lucide React

## 🎯 Project Structure

```
.
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

## 🙏 Acknowledgements

- [Jan AI](https://jan.ai) - Original application inspiration
- [Lucide React](https://lucide.dev/) - Clean, consistent icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
