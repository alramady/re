import { motion } from 'framer-motion';
import { Search, Send, Bot, User, Sparkles, MessageSquare, Lightbulb, FileText, Shield } from 'lucide-react';
import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { IMAGES } from '@/lib/images';

const suggestedQuestions = [
  'ما هو مستوى الامتثال الحالي للقطاع الصحي؟',
  'كم عدد حوادث تسريب البيانات في الربع الأخير؟',
  'ما هي أبرز المخاطر على البيانات الشخصية؟',
  'اعرض تقرير الامتثال للجهات الحكومية',
  'ما هي متطلبات نظام حماية البيانات الشخصية؟',
  'حلل اتجاهات الحوادث الأمنية',
];

interface ChatMsg {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, role: 'assistant', content: 'مرحباً! أنا راصد الذكي، مساعدك في تحليل البيانات الوطنية والامتثال لنظام حماية البيانات الشخصية. كيف يمكنني مساعدتك اليوم؟' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    const userMsg: ChatMsg = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    
    setTimeout(() => {
      const response: ChatMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `بناءً على تحليل البيانات المتاحة، يمكنني إفادتك بالتالي:\n\nمستوى الامتثال الوطني الحالي يبلغ 78.5% وهو في تحسن مستمر. القطاع المالي يتصدر بنسبة 91% يليه القطاع الحكومي بنسبة 88%.\n\nهل تريد تفاصيل أكثر عن قطاع محدد؟`
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A192F] to-[#1a2744] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#C5A55A]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0A192F] dark:text-white">راصد الذكي</h2>
            <p className="text-xs text-[#0A192F]/40 dark:text-white/40">مساعد ذكي لتحليل البيانات الوطنية</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-[#0A192F] to-[#1a2744]' : 'bg-[#C5A55A]/20'}`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-[#C5A55A]" /> : <User className="w-4 h-4 text-[#C5A55A]" />}
              </div>
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'glass-card' : 'bg-[#0A192F] text-white dark:bg-[#C5A55A]/20 dark:text-white'}`}>
                <p className={msg.role === 'assistant' ? 'text-[#0A192F] dark:text-white' : ''} style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-[#0A192F]/40 dark:text-white/40 mb-3 flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#C5A55A]" />
              أسئلة مقترحة
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(q); }}
                  className="text-right p-3 rounded-xl bg-[#0A192F]/3 dark:bg-white/3 hover:bg-[#0A192F]/5 dark:hover:bg-white/5 text-xs text-[#0A192F]/60 dark:text-white/60 transition-all border border-transparent hover:border-[#C5A55A]/20"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="glass-card p-2 flex items-center gap-3">
          <button className="p-2 rounded-xl hover:bg-[#0A192F]/5 dark:hover:bg-white/5 transition-colors">
            <Sparkles className="w-5 h-5 text-[#C5A55A]" />
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل راصد الذكي..."
            className="flex-1 bg-transparent text-sm outline-none text-[#0A192F] dark:text-white placeholder:text-[#0A192F]/30 dark:placeholder:text-white/30"
          />
          <button
            onClick={handleSend}
            disabled={!query.trim()}
            className="p-2 rounded-xl bg-[#0A192F] dark:bg-[#C5A55A] text-white dark:text-[#0A192F] disabled:opacity-30 transition-all hover:opacity-80"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
