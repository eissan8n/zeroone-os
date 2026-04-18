import React, { useState, useEffect } from 'react';
import './App.css';

// Persian numbers mapping
const persianNumbers: { [key: number]: string } = {
  0: 'صفر', 1: 'يك', 2: 'دو', 3: 'ثه', 4: 'جهار',
  5: 'بنج', 6: 'شيش', 7: 'هفت', 8: 'هشت', 9: 'نوه', 10: 'ده'
};

const getPersianNumber = (num: number): string => {
  if (num <= 10) return persianNumbers[num] || num.toString();
  return num.toString();
};

interface Task {
  text: string;
  done: boolean;
}

const App: React.FC = () => {
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<string[]>(['✨ مرحباً بك في ZeroOne OS. اكتب "ساعدني".']);
  const [notes, setNotes] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [walletBalance] = useState<number>(147770);

  // Load from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('zeroone_notes');
    const savedTasks = localStorage.getItem('zeroone_tasks');
    const savedLogs = localStorage.getItem('zeroone_logs');
    
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('zeroone_notes', JSON.stringify(notes));
    localStorage.setItem('zeroone_tasks', JSON.stringify(tasks));
    localStorage.setItem('zeroone_logs', JSON.stringify(logs.slice(0, 50)));
  }, [notes, tasks, logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ar-EG');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    const lowerCmd = cmd.toLowerCase().trim();
    addLog(`> ${cmd}`);

    // محفظتي / رصيدي
    if (lowerCmd === 'محفظتي' || lowerCmd === 'رصيدي') {
      addLog(`💰 الرصيد الحالي: ${walletBalance.toLocaleString()} ج.م`);
    }
    // ضيف ملاحظة
    else if (lowerCmd.startsWith('ضيف ملاحظة:')) {
      const noteText = cmd.replace(/ضيف ملاحظة:/i, '').trim();
      if (noteText) {
        setNotes(prev => [noteText, ...prev]);
        addLog(`✓ تمت إضافة الملاحظة: "${noteText}"`);
      }
    }
    // ضيف مهمة
    else if (lowerCmd.startsWith('ضيف مهمة:')) {
      const taskText = cmd.replace(/ضيف مهمة:/i, '').trim();
      if (taskText) {
        setTasks(prev => [{ text: taskText, done: false }, ...prev]);
        addLog(`✓ تمت إضافة المهمة: "${taskText}"`);
      }
    }
    // احسب بالفارسي
    else if (lowerCmd.startsWith('احسب بالفارسي')) {
      const expr = cmd.replace(/احسب بالفارسي/i, '').trim();
      try {
        // eslint-disable-next-line no-eval
        const result = eval(expr);
        const persian = getPersianNumber(result);
        addLog(`🧮 ${expr} = ${result} (${persian})`);
      } catch {
        addLog(`❌ خطأ في الحساب: ${expr}`);
      }
    }
    // احسب
    else if (lowerCmd.startsWith('احسب')) {
      const expr = cmd.replace(/احسب/i, '').trim();
      try {
        // eslint-disable-next-line no-eval
        const result = eval(expr);
        addLog(`🧮 ${expr} = ${result}`);
      } catch {
        addLog(`❌ خطأ في الحساب: ${expr}`);
      }
    }
    // تتبع شحنتي
    else if (lowerCmd === 'تتبع شحنتي') {
      const statuses = ['📦 تم الشحن', '🏭 في المستودع', '🚚 في الطريق', '✅ تم التسليم'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      addLog(`📦 حالة الشحنة: ${randomStatus}`);
    }
    // ساعدني
    else if (lowerCmd === 'ساعدني') {
      addLog('📋 الأوامر المتاحة:');
      addLog('• محفظتي / رصيدي');
      addLog('• ضيف ملاحظة: [نص]');
      addLog('• ضيف مهمة: [نص]');
      addLog('• احسب [معادلة]');
      addLog('• احسب بالفارسي [معادلة]');
      addLog('• تتبع شحنتي');
    }
    else {
      addLog(`❌ أمر غير معروف: "${cmd}". اكتب "ساعدني"`);
    }
    
    setCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    }
  };

  const toggleTask = (index: number) => {
    setTasks(prev => prev.map((t, i) => 
      i === index ? { ...t, done: !t.done } : t
    ));
  };

  const deleteTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
    addLog(`🗑️ تم حذف المهمة`);
  };

  const deleteNote = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
    addLog(`🗑️ تم حذف الملاحظة`);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>⚡ ZeroOne OS</h1>
        <p className="tagline">Human Ingenuity + AI Speed = Unbeatable Production</p>
      </header>

      {/* Command Bar */}
      <div className="command-bar-container">
        <input
          type="text"
          className="command-input"
          placeholder='اكتب أمراً... (مثال: محفظتي)'
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="suggestions">
          {['محفظتي', 'ضيف ملاحظة', 'ضيف مهمة', 'احسب', 'تتبع شحنتي', 'ساعدني'].map(cmd => (
            <span key={cmd} className="chip" onClick={() => setCommand(cmd)}>
              {cmd}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      <div className="dashboard-grid">
        {/* Wallet Pane */}
        <div className="pane">
          <h3>💰 المحفظة المالية</h3>
          <div className="wallet-balance">{walletBalance.toLocaleString()} ج.م</div>
          <div className="wallet-subtitle">Super Wallet (26 طريقة)</div>
        </div>

        {/* Notes Pane */}
        <div className="pane">
          <h3>📝 الملاحظات ({notes.length})</h3>
          <div className="item-list">
            {notes.slice(0, 3).map((note, i) => (
              <div key={i} className="item">
                <span>• {note}</span>
                <button className="delete-btn" onClick={() => deleteNote(i)}>✕</button>
              </div>
            ))}
            {notes.length === 0 && <div className="empty-state">لا توجد ملاحظات</div>}
          </div>
        </div>

        {/* Tasks Pane */}
        <div className="pane">
          <h3>📋 المهام ({tasks.filter(t => !t.done).length})</h3>
          <div className="item-list">
            {tasks.slice(0, 3).map((task, i) => (
              <div key={i} className="item task-item">
                <span 
                  style={{ textDecoration: task.done ? 'line-through' : 'none' }}
                  onClick={() => toggleTask(i)}
                >
                  • {task.text}
                </span>
                <button className="delete-btn" onClick={() => deleteTask(i)}>✕</button>
              </div>
            ))}
            {tasks.length === 0 && <div className="empty-state">لا توجد مهام</div>}
          </div>
        </div>

        {/* Recent Logs Pane */}
        <div className="pane">
          <h3>🤖 آخر الأوامر</h3>
          <div className="log-pane">
            {logs.slice(0, 4).map((log, i) => (
              <div key={i} className="log-entry">{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Hubs */}
      <div className="hubs-container">
        <div className="hub-card">
          <span className="hub-icon">📦</span>
          <h4>Amazon Hub</h4>
          <p>FBA + AWS + Pay</p>
        </div>
        <div className="hub-card">
          <span className="hub-icon">🌍</span>
          <h4>Alibaba Hub</h4>
          <p>B2B + Accio AI</p>
        </div>
        <div className="hub-card">
          <span className="hub-icon">🧠</span>
          <h4>AI Orchestrator</h4>
          <p>Claude • GPT • Groq</p>
        </div>
      </div>

      {/* Output Log */}
      <div className="output-log">
        {logs.map((log, i) => (
          <div key={i} className="log-line">{log}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
