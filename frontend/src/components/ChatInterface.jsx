import { useState, useRef, useEffect } from 'react';
import { Send, Mic, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';
import Groq from "groq-sdk";
import { DualText, useLanguage } from '../App';

export const ChatInterface = () => {
    const { lang } = useLanguage();
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Namaste! I am your KrishiSahay assistant. How can I help you with your farm today?', type: 'text' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [apiKey] = useState('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');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const handleSend = async (textOverride = null) => {
        const messageText = textOverride || input;
        if (!messageText.trim()) return;

        const userMsg = { role: 'user', content: messageText, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateGroqResponse(messageText);
            setMessages(prev => [...prev, { role: 'ai', content: response, type: 'text' }]);

            // Automatically speak the response if voice mode was used or by default
            speakResponse(response);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: `Error: Failed to connect to AI engine. Please try again later.`, type: 'text' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const generateGroqResponse = async (query) => {
        const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are KrishiSahay, a helpful AI agricultural expert. 
                    Current User Language Preference code: ${lang}. 
                    If the language code is not 'en', please provide the answer primarily in that language. 
                    Keep it practical, supportive, and concise (under 100 words) for Indian farmers.`
                },
                { role: "user", content: query }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "No response received.";
    };

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                // Map local lang code to BCP 47
                const langMap = {
                    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN',
                    te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN',
                    bn: 'bn-IN', gu: 'gu-IN', pa: 'pa-IN'
                };
                recognitionRef.current.lang = langMap[lang] || 'en-IN';
                recognitionRef.current.start();
                setIsListening(true);
            } else {
                alert("Speech recognition is not supported in your browser.");
            }
        }
    };

    const speakResponse = (text) => {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);

        // Map local lang code to BCP 47 for playback
        const langMap = {
            en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN',
            te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN',
            bn: 'bn-IN', gu: 'gu-IN', pa: 'pa-IN'
        };
        utterance.lang = langMap[lang] || 'en-IN';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="glass-panel" style={{
            maxWidth: '600px',
            margin: '2rem auto',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            textAlign: 'left'
        }}>
            <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: isListening ? '#ef4444' : '#10b981',
                        boxShadow: `0 0 8px ${isListening ? '#ef4444' : '#10b981'}`,
                        animation: isListening ? 'pulse 1.5s infinite' : 'none'
                    }}></div>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#f8fafc' }}>
                        <DualText english="Krishi Assistant" id="chat_welcome" />
                    </h2>
                </div>
                {isSpeaking && (
                    <button onClick={stopSpeaking} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                        <Volume2 size={20} className="animate-pulse" />
                    </button>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        gap: '0.75rem'
                    }}>
                        {msg.role === 'ai' && <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}><Bot size={18} color="white" /></div>}

                        <div style={{
                            background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255,255,255,0.05)',
                            padding: '0.85rem 1.1rem',
                            borderRadius: '16px',
                            borderTopLeftRadius: msg.role === 'ai' ? '2px' : '16px',
                            borderTopRightRadius: msg.role === 'user' ? '2px' : '16px',
                            color: '#f8fafc',
                            lineHeight: '1.6',
                            fontSize: '0.95rem',
                            border: msg.role === 'ai' ? '1px solid var(--border)' : 'none'
                        }}>
                            {msg.content}
                        </div>

                        {msg.role === 'user' && <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#475569',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}><User size={18} color="white" /></div>}
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={18} color="white" /></div>
                        <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', borderTopLeftRadius: '2px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
                            <Loader2 size={16} className="animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{
                padding: '1.25rem',
                borderTop: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                gap: '0.75rem'
            }}>
                <button onClick={toggleVoice} style={{
                    background: isListening ? '#ef4444' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'all 0.2s',
                    boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}>
                    <Mic size={20} />
                </button>
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Listening..." : "Ask anything about farming..."}
                        style={{
                            width: '100%',
                            height: '46px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '23px',
                            padding: '0 1.25rem',
                            color: 'white',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                        disabled={isLoading}
                    />
                </div>
                <button onClick={() => handleSend()} className="btn-primary" style={{ width: '46px', height: '46px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
