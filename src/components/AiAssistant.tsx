import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, X, User, RefreshCw, Compass, MapPin } from 'lucide-react';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Bonjour ! Je suis AfroKu IA, votre assistant intelligent du tourisme et de la culture au Bénin. Je peux vous aider à planifier votre voyage, trouver un guide certifié, découvrir des artisans locaux ou organiser une immersion à Ganvié, Ouidah ou Abomey. Que souhaitez-vous découvrir ?",
      timestamp: 'À l\'instant',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "📌 Propose un circuit de 3 jours Cotonou - Ouidah - Ganvié",
    "🎨 Où rencontrer des maîtres artisans du bronze et du tissage ?",
    "🐘 Quelle est la meilleure saison pour faire un safari à la Pendjari ?",
    "🛖 Comment visiter les Tatas Somba à Natitingou ?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputText('');
    setLoading(true);
    setCurrentSuggestions([]); // Temporarily clear while loading

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query,
          history: updatedMessages
        }),
      });

      const data = await response.json();
      let aiReply = data.reply || data.error || "Désolé, je n'ai pas pu générer de réponse.";
      aiReply = aiReply.replace(/\*+/g, '');

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setCurrentSuggestions(data.suggestions);
      } else {
        setCurrentSuggestions([
          "Comment réserver cette expérience ?",
          "Quel est le budget moyen à prévoir ?",
          "Voir d'autres recommandations à proximité"
        ]);
      }
    } catch (err) {
      console.error('Erreur Chat AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Je rencontre une petite difficulté de connexion. En attendant, consultez nos guides et artisans recommandés sur AfroKu.com !",
          timestamp: 'À l\'instant',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDiscussionStarted = messages.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in [overscroll-behavior:contain]">
      <div className="w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col justify-between border-l border-amber-200 dark:border-slate-800 [overscroll-behavior:contain] text-slate-900 dark:text-slate-100">
        {/* Header Drawer */}
        <div className="bg-gradient-to-r from-[#003580] to-[#002255] text-white p-4 flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-base">AfroKu IA</h3>
              <p className="text-xs text-white/80">Assistant intelligent & conseils de voyage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/90">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#003580] text-white rounded-br-none shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 dark:text-slate-400 text-xs italic">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl flex items-center gap-2 shadow-2xs text-slate-800 dark:text-slate-200">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
                <span>AfroKu IA prépare vos conseils...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic / Initial Suggestions Section */}
        {!isDiscussionStarted ? (
          /* INITIAL STATE: Fixed "Questions fréquentes" before discussion launches */
          <div className="p-3 bg-amber-50 dark:bg-slate-900 border-t border-amber-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Questions fréquentes :</span>
            </p>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-left text-xs bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 transition-colors truncate font-medium shadow-2xs cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ACTIVE DISCUSSION STATE: Contextual follow-up suggestions tailored to conversation */
          currentSuggestions.length > 0 && (
            <div className="p-2.5 bg-gradient-to-r from-amber-50/80 to-slate-50 dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Suggestions de relance :</span>
              </p>
              <div className="flex flex-col gap-1.5">
                {currentSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    disabled={loading}
                    className="text-left text-xs bg-white dark:bg-slate-800 hover:bg-amber-100/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-amber-300/60 dark:border-slate-700 hover:border-amber-400 rounded-lg px-3 py-1.5 transition-all font-semibold shadow-2xs cursor-pointer flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{suggestion}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {/* Chat Input */}
        <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question sur le Bénin..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            className="w-9 h-9 rounded-full bg-[#003580] hover:bg-[#002866] text-white flex items-center justify-center disabled:opacity-40 transition-colors shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
