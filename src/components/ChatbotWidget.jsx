import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hi! I am FitGuardian AI. How can I help you today?' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { prompt: userMsg });
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Sorry, I am having trouble connecting right now.';
            setMessages(prev => [...prev, { sender: 'ai', text: errorMsg }]);
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="glass-card w-80 h-96 flex flex-col overflow-hidden border-neonGreen/30 shadow-[0_0_20px_rgba(57,255,20,0.15)] animate-in slide-in-from-bottom-5">
                    <div className="bg-neonGreen/10 border-b border-neonGreen/20 px-4 py-3 flex justify-between items-center">
                        <span className="font-bold text-neonGreen flex items-center gap-2">
                            <MessageSquare size={18} /> FitGuardian AI
                        </span>
                        <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-textMain">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050505]/80">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-electricCyan/20 text-electricCyan ml-auto rounded-br-none' : 'bg-black/10 dark:bg-white/10 text-textMain mr-auto rounded-bl-none'}`}>
                                {msg.sender === 'user' ? (
                                    msg.text
                                ) : (
                                    <div className="prose prose-sm prose-invert prose-p:leading-snug prose-ul:my-1 prose-p:my-1 max-w-none">
                                        <ReactMarkdown>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="text-gray-500 text-xs animate-pulse">AI is typing...</div>}
                    </div>

                    <form onSubmit={sendMessage} className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-3 text-sm text-textMain focus:outline-none focus:border-neonGreen"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="p-2 bg-neonGreen/20 text-neonGreen rounded-lg hover:bg-neonGreen hover:text-black transition-colors">
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-neonGreen rounded-full flex items-center justify-center text-[#0a0a0a] shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:scale-110 transition-transform duration-300"
                >
                    <MessageSquare size={24} />
                </button>
            )}
        </div>
    );
};

export default ChatbotWidget;
