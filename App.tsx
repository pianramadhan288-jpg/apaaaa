
import React, { useState, useMemo, useEffect } from 'react';
import { AnalysisInput, AnalysisResult, PublicStockData, BrokerInfo, BrokerCategory } from './types';
import { BROKER_DB, SIGNAL_TEMPLATES } from './constants';
import { fetchPublicData, performDeepReasoning } from './services/geminiService';

// --- PERUBAHAN KRUSIAL ---
// Ganti string di bawah ini dengan API Key Gemini Anda yang asli.
const API_KEY = "AIzaSyBwz9kUStSyK3y8oxahBLBikpRaLBmGjA8"; 
// -------------------------

const DISCLAIMER_VARIANTS = [
  "Pasar modal adalah entitas dinamis yang dipengaruhi oleh variabel makro dan mikro tak terduga. Sistem ini bertindak sebagai asisten analisis data kuantitatif, bukan penentu keberhasilan mutlak.",
  "Analisis ini merupakan representasi data historis dan struktur pasar saat ini. Perubahan volatilitas mendadak dapat membatalkan sinyal teknis dalam hitungan detik. Gunakan sebagai referensi sekunder.",
  "Velarc dirancang untuk memperjelas anomali data, namun keputusan akhir tetap berada pada intuisi dan manajemen risiko trader. Tidak ada algoritma yang mampu menjamin profitabilitas 100%.",
  "Sistem ini membantu memetakan jejak akumulasi institusi, namun strategi 'Market Maker' dapat berubah sewaktu-waktu. Selalu prioritaskan batasan Stop Loss yang telah ditentukan.",
  "Market data bersifat probabilistik, bukan deterministik. Velarc hadir untuk memperkecil bias emosional melalui data real, namun tidak menghilangkan risiko pasar yang melekat."
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState<string>('');
  const [avgPrice, setAvgPrice] = useState<string>('');
  const [publicData, setPublicData] = useState<PublicStockData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [dynamicDisclaimer, setDynamicDisclaimer] = useState('');

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * DISCLAIMER_VARIANTS.length);
    setDynamicDisclaimer(DISCLAIMER_VARIANTS[randomIdx]);
  }, []);

  // Manual Inputs
  const [orderBook, setOrderBook] = useState<'Buy Dominan' | 'Sell Dominan'>('Buy Dominan');
  const [tradeBook, setTradeBook] = useState<'Buy Dominan' | 'Sell Dominan'>('Buy Dominan');
  const [brokerSummary, setBrokerSummary] = useState(50);
  const [topBrokersStr, setTopBrokersStr] = useState('');

  const identifiedBrokers = useMemo(() => {
    return topBrokersStr
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length >= 2)
      .map(code => BROKER_DB[code])
      .filter(Boolean);
  }, [topBrokersStr]);

  const getSummaryLabel = (val: number) => {
    if (val <= 20) return { label: 'Big Distribution', color: 'text-rose-500' };
    if (val <= 40) return { label: 'Distribution', color: 'text-rose-400' };
    if (val <= 60) return { label: 'Neutral', color: 'text-slate-400' };
    if (val <= 80) return { label: 'Accumulation', color: 'text-emerald-400' };
    return { label: 'Big Accumulation', color: 'text-emerald-500' };
  };

  const handleFetchPublic = async () => {
    if (!ticker || API_KEY === "MASUKKAN_API_KEY_ANDA_DI_SINI") {
      if (API_KEY === "MASUKKAN_API_KEY_ANDA_DI_SINI") {
        alert("Harap masukkan API Key Anda di dalam kode App.tsx");
      }
      return;
    }
    setLoading(true);
    setAnalysisResult(null); 
    try {
      const data = await fetchPublicData(ticker.toUpperCase(), API_KEY);
      setPublicData(data);
    } catch (error: any) {
      console.error(error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!ticker || !publicData || !price || !avgPrice || API_KEY === "MASUKKAN_API_KEY_ANDA_DI_SINI") return;
    setLoading(true);

    const priceNum = parseInt(price) || 0;
    const avgNum = parseInt(avgPrice) || 0;
    
    const input: AnalysisInput = {
      ticker: ticker.toUpperCase(),
      price: priceNum,
      avgPrice: avgNum,
      orderBook,
      tradeBook,
      brokerSummary,
      topBrokers: identifiedBrokers.map(b => b.code)
    };

    const isRichAcc = identifiedBrokers.some(b => b.category === BrokerCategory.RICH || b.category === BrokerCategory.KONGLO) && brokerSummary >= 60;
    
    const template = SIGNAL_TEMPLATES.find(t => t.condition(input, isRichAcc))?.text || SIGNAL_TEMPLATES[SIGNAL_TEMPLATES.length - 1].text;

    try {
      const reasoning = await performDeepReasoning(input, publicData, identifiedBrokers, template, API_KEY);
      
      const isPositive = isRichAcc || (brokerSummary > 60 && tradeBook === 'Buy Dominan');
      const tp = priceNum > 0 ? (isPositive ? priceNum * 1.08 : priceNum * 1.04) : 0;
      const sl = priceNum > 0 ? (isPositive ? priceNum * 0.96 : priceNum * 0.92) : 0;

      let risk: 'red' | 'yellow' | 'green' = 'yellow';
      let riskExp = '';

      const hasRichAcc = isRichAcc;
      const isNegative = brokerSummary <= 40 || (identifiedBrokers.every(b => b.category === BrokerCategory.AMPAS) && brokerSummary < 60);

      if (hasRichAcc && tradeBook === 'Buy Dominan') {
        risk = 'green';
        riskExp = "Structured Trading – Direkomendasikan. Probabilitas hasil positif tinggi dengan dukungan multi-layer (fundamental, pasar, teknikal). Cocok untuk swing atau day trading dengan disiplin risk 1-2% per posisi.";
      } else if (isNegative) {
        risk = 'red';
        riskExp = "High-Risk Speculation – Tidak Direkomendasikan. Probabilitas hasil negatif tinggi karena dominasi distribusi dan kurangnya dukungan institusi kuat. Hindari entry atau pertimbangkan posisi short dengan risiko ketat.";
      } else {
        risk = 'yellow';
        riskExp = "Moderate-Risk Speculation – Hati-hati. Potensi hasil positif terbatas pada jangka pendek dengan risiko koreksi tinggi. Cocok hanya untuk trader berpengalaman dengan risk management ketat and exit cepat.";
      }

      const comparisonText = priceNum > avgNum 
        ? `Harga saat ini (${priceNum}) berada DI ATAS rata-rata bandar (${avgNum}). Broker penguasa sedang dalam posisi profit, risiko distribusi (profit taking) sangat tinggi.`
        : `Harga saat ini (${priceNum}) berada DI BAWAH rata-rata bandar (${avgNum}). Broker penguasa sedang dalam posisi floating loss, ada potensi penjagaan harga atau akumulasi lanjutan.`;

      setAnalysisResult({
        signalTemplate: template,
        recommendation: risk === 'green' ? "Investasi Terstruktur" : "Spekulasi Berisiko",
        riskColor: risk,
        riskExplanation: riskExp,
        timeframe: reasoning.toLowerCase().includes("swing") ? "Swing Trade" : "Day Trade",
        strategy: reasoning.toLowerCase().includes("day trade") ? "Day Trade" : "Swing Trade",
        targetPrice: Math.round(tp),
        stopLoss: Math.round(sl),
        reasoning,
        brokerDetails: identifiedBrokers,
        avgComparison: comparisonText
      });
    } catch (error: any) {
      console.error(error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#05070a] text-[#e2e8f0] pb-20 px-4 md:px-8 relative overflow-x-hidden">
      {/* Top Header Section with fixed spacing to avoid overlapping */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-6 md:py-10">
        <div className="flex-1 hidden md:block"></div>
        
        {/* Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-block mb-3 relative">
            <div className="w-10 h-10 border-2 border-cyan-500 rotate-45 flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-cyan-500"></div>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2 uppercase condensed">
            Ve ' larc <span className="text-cyan-500">Analyzer</span>
          </h1>
          <p className="text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase max-w-[280px] md:max-w-none leading-relaxed">
            Analisis Saham Berbasis Data & Intelegensi
          </p>
        </div>

        {/* Info Button */}
        <div className="mt-6 md:mt-0 md:flex-1 flex md:justify-end">
          <button 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-500/30 bg-[#0d1117]/50 hover:bg-cyan-500/10 rounded-full transition-all group"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse group-hover:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Metodologi</span>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="max-w-2xl w-full bg-[#0d1117] border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-8 border-b border-slate-800/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-1">Integritas Data & Logika AI</h3>
                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Sistem Analisis Berstandar Institusi 2026</p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all text-slate-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <section className="space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-1 bg-cyan-500"></div> Sumber Data Real-Time
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  Seluruh data publik diproses secara langsung melalui integrasi API dari sumber resmi: <strong>IDX (Bursa Efek Indonesia)</strong>, <strong>OJK (Otoritas Jasa Keuangan)</strong>, dan <strong>KSEI (Kustodian Sentral Efek Indonesia)</strong>. Kami menjamin validitas profil emiten, laporan keuangan, hingga struktur kepemilikan tanpa asumsi spekulatif.
                </p>
              </section>
              <section className="space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500"></div> Intelegensi Bandarmology Modern
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  Algoritma kami mengadopsi metodologi <em>Market Structure & Volume Analysis</em> profesional. Sistem membedakan secara tegas antara akumulasi <strong>Rich Brokers (Institusi/Asing)</strong> dengan aktivitas <strong>Ampas/Ritel</strong>. Logika ini dirancang untuk mendeteksi pergerakan uang besar yang seringkali tidak terlihat di permukaan.
                </p>
              </section>

              {/* Dynamic Helper Disclaimer Section */}
              <section className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-1 bg-rose-500"></div> Batasan & Risk Disclosure
                </h4>
                <div className="p-3 bg-black/20 rounded border border-rose-500/10">
                   <p className="text-xs leading-relaxed text-rose-200/80 italic font-medium">
                     {dynamicDisclaimer}
                   </p>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 uppercase font-bold tracking-tight">
                  Sistem ini berfungsi sebagai <span className="text-rose-400/80">pembantu keputusan (decision support)</span>, bukan pemberi kepastian mutlak. Market BEI bersifat dinamis; analisis ini hanya valid selama parameter pasar tetap konstan.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500"></div> Deep Reasoning Processor
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  Berbeda dengan AI generatif biasa, sistem kami menggunakan <em>Constraint-Based Reasoning</em>. AI dilatih untuk memprioritaskan data kuantitatif (Broker Summary, Trade Book) di atas narasi berita, menghasilkan kesimpulan objektif apakah sebuah emiten berada dalam fase distribusi atau akumulasi yang sehat.
                </p>
              </section>
              <div className="pt-4 border-t border-slate-800/50">
                <p className="text-[10px] italic text-slate-500 text-center font-medium">
                  "Keputusan investasi cerdas dimulai dari data yang benar, bukan sekadar prediksi."
                </p>
              </div>
            </div>
            <div className="p-6 bg-[#05070a] text-center">
              <button 
                onClick={() => setShowInfo(false)}
                className="px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                Kembali ke Analisis
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Main Input */}
          <section className="bg-[#0d1117] border border-[#1c212b] rounded-xl p-6 shadow-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
              Parameter Saham
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-2 font-bold tracking-tighter">Ticker Saham</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: BBCA" 
                    className="w-full bg-[#05070a] border border-[#1c212b] rounded px-4 py-2.5 focus:border-cyan-500 outline-none transition-all text-white text-sm uppercase placeholder-slate-800"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-2 font-bold tracking-tighter">Harga Terakhir</label>
                  <input 
                    type="number" 
                    placeholder="Contoh: 10500" 
                    className="w-full bg-[#05070a] border border-[#1c212b] rounded px-4 py-2.5 focus:border-cyan-500 outline-none transition-all text-white text-sm placeholder-slate-800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleFetchPublic}
                disabled={loading || !ticker}
                className="w-full bg-cyan-700 hover:bg-cyan-600 text-white py-2.5 rounded font-bold transition-all text-xs uppercase tracking-widest disabled:opacity-30"
              >
                {loading ? 'Fetching...' : 'Fetch Data'}
              </button>

              {publicData && (
                <div className="p-4 bg-[#05070a] rounded border border-slate-800/50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                  <h3 className="text-sm font-bold text-white mb-4">{publicData.name}</h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-black/30 rounded border border-slate-800/50">
                      <h4 className="text-[9px] uppercase font-bold text-slate-600 mb-2 tracking-widest">Alamat & Manajemen</h4>
                      <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">{publicData.address}</p>
                      <div className="flex flex-wrap gap-1">
                        {publicData.directors.map((d, i) => (
                          <span key={i} className="text-[9px] bg-slate-800/50 px-2 py-1 rounded text-slate-500">{d}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-black/30 rounded border border-slate-800/50">
                        <h4 className="text-[9px] uppercase font-bold text-slate-600 mb-1 tracking-widest">OWNERSHIP</h4>
                        <p className="text-[10px] text-darkgrey-500 font-bold leading-relaxed">{publicData.ownership}</p>
                      </div>
                      <div className="p-3 bg-black/30 rounded border border-slate-800/50">
                        <h4 className="text-[9px] uppercase font-bold text-slate-600 mb-1 tracking-widest">ACTION</h4>
                        <p className="text-[10px] text-indigo-400 font-bold leading-relaxed">{publicData.corporateAction}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-black/30 rounded border border-slate-800/50">
                      <h4 className="text-[9px] uppercase font-bold text-slate-600 mb-2 tracking-widest">Financial & Market Insight</h4>
                      <p className="text-[10px] leading-relaxed text-slate-300 mb-2 font-medium">{publicData.financialSummary}</p>
                      <p className="text-[10px] leading-relaxed text-slate-400 italic">{publicData.marketData}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Manual Input */}
          <section className="bg-[#0d1117] border border-[#1c212b] rounded-xl p-6 shadow-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              Analisis Broker (Sore/Market Close)
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[10px] uppercase text-slate-500 mb-2 font-bold">Order Book</label>
                <select 
                  className="w-full bg-[#05070a] border border-[#1c212b] rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  value={orderBook}
                  onChange={(e) => setOrderBook(e.target.value as any)}
                >
                  <option>Buy Dominan</option>
                  <option>Sell Dominan</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-slate-500 mb-2 font-bold">Trade Book</label>
                <select 
                  className="w-full bg-[#05070a] border border-[#1c212b] rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  value={tradeBook}
                  onChange={(e) => setTradeBook(e.target.value as any)}
                >
                  <option>Buy Dominan</option>
                  <option>Sell Dominan</option>
                </select>
              </div>
            </div>

            {/* 5-Segment Slider */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] uppercase text-slate-500 font-bold">Broker Summary Status</label>
                <span className={`text-[11px] font-black uppercase tracking-widest ${getSummaryLabel(brokerSummary).color}`}>
                  {getSummaryLabel(brokerSummary).label}
                </span>
              </div>
              <div className="relative pt-1 px-1">
                <input 
                  type="range" 
                  className="w-full h-1 bg-[#1c212b] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  min="0" max="100" step="1"
                  value={brokerSummary}
                  onChange={(e) => setBrokerSummary(parseInt(e.target.value))}
                />
                <div className="flex justify-between mt-2 px-0.5">
                  {[0, 25, 50, 75, 100].map(dot => (
                    <div key={dot} className={`w-1 h-3 rounded-full ${brokerSummary >= dot - 12 && brokerSummary <= dot + 12 ? 'bg-cyan-500 shadow-cyan-500/20 shadow-md' : 'bg-[#1c212b]'}`}></div>
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-slate-600 mt-2 uppercase font-bold">
                  <span>Big Dist</span>
                  <span>Dist</span>
                  <span>Neutral</span>
                  <span>Acc</span>
                  <span>Big Acc</span>
                </div>
              </div>
            </div>

            {/* Top Brokers and Avg Price */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-2 font-bold">Top Brokers (Kode)</label>
                  <input 
                    type="text" 
                    placeholder="BK, AK, CS..." 
                    className="w-full bg-[#05070a] border border-[#1c212b] rounded px-3 py-2.5 text-sm text-white uppercase outline-none focus:border-indigo-500 placeholder-slate-800"
                    value={topBrokersStr}
                    onChange={(e) => setTopBrokersStr(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-2 font-bold">Avg Price Top Broker</label>
                  <input 
                    type="number" 
                    placeholder="Contoh: 10450" 
                    className="w-full bg-[#05070a] border border-[#1c212b] rounded px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 placeholder-slate-800"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Dynamic Broker Cards */}
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {identifiedBrokers.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#05070a]/50 rounded border border-slate-800/40 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${b.category === BrokerCategory.RICH ? 'bg-cyan-500/10 text-cyan-400' : b.category === BrokerCategory.KONGLO ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>{b.code}</span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white">{b.name}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">{b.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={loading || !publicData || !price || !avgPrice}
              className="w-full mt-10 bg-white hover:bg-slate-200 text-black py-3.5 rounded font-black transition-all text-[11px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-20 flex items-center justify-center gap-3"
            >
              {loading ? 'Processing Intelligence...' : 'Analysis'}
            </button>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-8">
          {analysisResult ? (
            <section className="bg-[#0d1117] border border-[#1c212b] rounded-xl p-8 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col mb-8 pb-6 border-b border-slate-800/50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-black uppercase condensed text-white tracking-tighter">
                    {ticker} <span className="text-cyan-500">INSIGHT</span>
                  </h2>
                  <div className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded uppercase tracking-widest text-slate-400">
                    {analysisResult.strategy}
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic font-medium">"{analysisResult.signalTemplate}"</p>
              </div>

              {/* Traffic Light System */}
              <div className={`mb-8 p-6 rounded-xl border flex items-center gap-6 ${
                analysisResult.riskColor === 'green' ? 'bg-emerald-900/10 border-emerald-500/30' :
                analysisResult.riskColor === 'yellow' ? 'bg-amber-900/10 border-amber-500/30' :
                'bg-rose-900/10 border-rose-500/30'
              }`}>
                <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${
                  analysisResult.riskColor === 'green' ? 'bg-emerald-500 shadow-emerald-500/20' :
                  analysisResult.riskColor === 'yellow' ? 'bg-amber-500 shadow-amber-500/20' :
                  'bg-rose-500 shadow-rose-500/20'
                }`}>
                  <div className="w-6 h-6 bg-white/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${
                    analysisResult.riskColor === 'green' ? 'text-emerald-400' :
                    analysisResult.riskColor === 'yellow' ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {analysisResult.riskColor === 'green' ? 'Structured Trading' :
                     analysisResult.riskColor === 'yellow' ? 'Moderate Risk' :
                     'High-Risk Speculation'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-bold uppercase tracking-tight">
                    {analysisResult.riskExplanation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-black/40 rounded border border-emerald-900/20 transition-all hover:border-emerald-500/40">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-2 tracking-wider">Estimasi TP</span>
                  <span className="text-2xl font-black text-emerald-400 condensed tracking-tight">{analysisResult.targetPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-5 bg-black/40 rounded border border-rose-900/20 transition-all hover:border-rose-500/40">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-2 tracking-wider">Batas SL</span>
                  <span className="text-2xl font-black text-rose-400 condensed tracking-tight">{analysisResult.stopLoss.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Price vs Avg Box */}
              <div className="mb-8 p-5 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Price vs Avg Top Broker Analysis</h4>
                 <p className={`text-xs leading-relaxed font-bold ${parseInt(price) > parseInt(avgPrice) ? 'text-rose-400' : 'text-emerald-400'}`}>
                   {analysisResult.avgComparison}
                 </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 border-l-2 border-cyan-500 pl-3">Deep Intelligence Reasoning</h4>
                <div className="text-slate-300 leading-relaxed text-sm font-medium whitespace-pre-wrap">
                  {analysisResult.reasoning}
                </div>
              </div>
            </section>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-[#1c212b] bg-[#0d1117]/30 rounded-xl text-slate-700">
               <div className="w-16 h-16 border-t-2 border-slate-800 rounded-full mb-6 opacity-30"></div>
               <p className="text-[10px] uppercase font-bold tracking-[0.2em] animate-pulse">Menunggu Parameter Analisis</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-24 text-center border-t border-slate-900 pt-10 pb-6">
        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.5em]">
          Velarc Intelligence System 
        </p>
        <p className="text-slate-800 text-[9px] font-medium mt-4">
          GNU Lesser General Public License
        </p>
      </footer>
    </div>
  );
};

export default App;
