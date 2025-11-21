import React, { useEffect, useState, useMemo } from 'react';
import { Post, AiSummary } from './types';
import PostCard from './components/PostCard';
import Stats from './components/Stats';
import { generateProfileSummary } from './services/geminiService';
import { RawCsvData } from './data';

const parseCSV = (csvText: string): Post[] => {
  const rows: Post[] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuote = false;

  // Skip header
  const startIndex = csvText.indexOf('\n') + 1;
  const body = csvText.substring(startIndex);

  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    const nextChar = body[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell);
      if (currentRow.length >= 2) {
        const content = currentRow[0];
        const timestamp = currentRow[currentRow.length - 1];
        if (timestamp && !isNaN(Date.parse(timestamp))) {
             rows.push({
                content: content,
                timestamp: timestamp,
                date: new Date(timestamp)
             });
        }
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if(currentCell) {
      currentRow.push(currentCell);
      if (currentRow.length >= 2) {
         rows.push({ content: currentRow[0], timestamp: currentRow[1], date: new Date(currentRow[1]) });
      }
  }

  return rows.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parsed = parseCSV(RawCsvData);
    setPosts(parsed);
  }, []);

  useEffect(() => {
    if (posts.length > 0 && !aiSummary && process.env.API_KEY) {
      setLoading(true);
      generateProfileSummary(posts)
        .then(summary => setAiSummary(summary))
        .finally(() => setLoading(false));
    }
  }, [posts]);

  return (
    <div className="min-h-screen w-full relative text-gray-700 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-kawaii-pink rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-kawaii-purple rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-kawaii-blue rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        
        {/* Hero Profile */}
        <header className="mb-16 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white p-2 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://api.dicebear.com/9.x/notionists/svg?seed=akazdayo&backgroundColor=ffdfbf" 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover bg-pink-50"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg text-3xl animate-bounce">
              👾
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-2 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-kawaii-rose to-purple-400">
                  akazdayo
                </span>
              </h1>
              <p className="text-xl text-gray-400 font-bold tracking-wider">@Portfolio</p>
            </div>

            {/* Gemini AI Analysis Card */}
            <div className="glass-panel p-8 rounded-[2rem] relative group">
              {loading ? (
                <div className="flex items-center justify-center py-8 space-x-3">
                  <div className="w-3 h-3 bg-kawaii-pink rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-kawaii-purple rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-kawaii-blue rounded-full animate-bounce delay-200"></div>
                  <span className="text-gray-400 font-bold">AI is thinking...</span>
                </div>
              ) : (
                <>
                  <div className="absolute -top-3 -left-3 bg-gradient-to-r from-kawaii-rose to-kawaii-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-6">
                    Gemini Analysis ✨
                  </div>
                  
                  <div className="space-y-4">
                    {aiSummary ? (
                      <>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {aiSummary.tags.map((tag, i) => (
                            <span key={i} className="px-4 py-1.5 bg-white/70 rounded-full text-sm font-bold text-gray-600 border border-white shadow-sm hover:bg-white transition-colors cursor-default">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-lg md:text-xl leading-relaxed font-medium text-gray-600">
                          {aiSummary.bio}
                        </p>
                        <div className="pt-4 border-t border-white/50 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-400">CURRENT VIBE</span>
                          <span className="text-2xl font-black text-kawaii-rose">{aiSummary.vibe}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-center">Analysis unavailable. Check API Key.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Stat Card 1 */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
            <span className="text-4xl mb-2">📝</span>
            <span className="text-5xl font-black text-gray-700 mb-1">{posts.length}</span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Posts</span>
          </div>

          {/* Stats Chart */}
          <div className="md:col-span-2">
            <Stats posts={posts} />
          </div>
        </div>

        {/* Timeline */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-700">Timeline</h2>
            <div className="h-1 flex-grow bg-gradient-to-r from-kawaii-pink to-transparent rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div key={index}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;