
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput, BrokerInfo, PublicStockData } from "../types";

function getAiClient(apiKey: string) {
  if (!apiKey) {
    throw new Error("API Key belum dimasukkan. Silakan masukkan API Key Anda.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function fetchPublicData(ticker: string, apiKey: string): Promise<PublicStockData> {
  const ai = getAiClient(apiKey);
  const prompt = `Cari dan sajikan data publik yang SUPER LENGKAP, DETAIL, DAN AKURAT untuk saham BEI ticker: ${ticker}. 
  Gunakan sumber resmi: IDX.co.id, OJK.go.id, KSEI.co.id, dan situs resmi emiten.
  
  Berikan informasi dalam format JSON:
  - name: Nama lengkap perusahaan, Bidang Usaha utama, Tahun Berdiri, dan Prospektus IPO (jika ada).
  - address: Alamat kantor pusat LENGKAP, nomor telepon, dan website resmi.
  - directors: Daftar LENGKAP Direksi Utama, Komisaris Utama, jajaran Direktur & Komisaris lainnya, serta Izin Usaha/Registrasi/Legalitas resmi perusahaan.
  - ownership: Struktur Kepemilikan LENGKAP (Persentase Ritel vs Institusi Lokal vs Asing vs Pemegang Saham Pengendali/Ultimate Beneficial Owner).
  - corporateAction: Histori Dividen LENGKAP terbaru, Rights Issue, Buyback, Stock Split, Reverse Stock Split, atau Merger/Akuisisi dalam 2 tahun terakhir.
  - financialSummary: Laporan Keuangan TERBARU (Neraca, Laba Rugi, Arus Kas). Masukkan rasio utama LENGKAP (PE, PBV, ROE, DER, NPM, GPM, EPS harian/kuartalan).
  - marketData: Data Pasar IDX LENGKAP: Harga real-time/EOD, Volume, Nilai, Frekuensi, Indeks sektoral, Net Foreign Buy/Sell (Harian & Mingguan), Statistik KSEI LENGKAP (Jumlah SID investor terdaftar, distribusi kepemilikan ritel vs institusi).
  - sources: Daftar link sumber resmi (IDX, OJK, KSEI, dsb).
  
  PENTING: Jangan menebak. Tampilkan data secara teliti, profesional, dan sejujur mungkin berdasarkan data publik yang tersedia di tahun 2026.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            directors: { type: Type.ARRAY, items: { type: Type.STRING } },
            ownership: { type: Type.STRING },
            corporateAction: { type: Type.STRING },
            financialSummary: { type: Type.STRING },
            marketData: { type: Type.STRING },
            sources: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "address", "directors", "ownership", "corporateAction", "financialSummary", "marketData", "sources"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as PublicStockData;
  } catch (error) {
    console.error("Error fetching public data:", error);
    throw error;
  }
}

export async function performDeepReasoning(
  input: AnalysisInput, 
  publicData: PublicStockData, 
  brokerDetails: BrokerInfo[],
  signalTemplate: string,
  apiKey: string
): Promise<string> {
  const ai = getAiClient(apiKey);
  const prompt = `Lakukan analisis mendalam (Deep Reasoning) untuk saham ${input.ticker} pada harga ${input.price} dengan Harga Rata-rata (Avg) Top Broker di ${input.avgPrice}.
  
  Data Input Bandarmology & Market:
  - Order Book: ${input.orderBook}
  - Trade Book: ${input.tradeBook}
  - Broker Summary Score: ${input.brokerSummary}/100
  - Top Brokers Terdeteksi: ${brokerDetails.map(b => `${b.code} (${b.category}: ${b.description})`).join(', ')}
  
  Data Publik LENGKAP:
  - Profil & Legalitas: ${publicData.name} | Alamat: ${publicData.address}
  - Manajemen: ${publicData.directors.join(', ')}
  - Keuangan & Rasio: ${publicData.financialSummary}
  - Kepemilikan & Aksi Korporasi: ${publicData.ownership} | ${publicData.corporateAction}
  - Market Data & SID Investor: ${publicData.marketData}
  
  Kesimpulan Awal Sistem: ${signalTemplate}

  Tugas Anda:
  1. Berikan analisis profesional lugas, teliti, dan tanpa asumsi. Prioritaskan: Rich Broker Big Acc > Trade Book > Order Book.
  2. Bandingkan Harga Sekarang (${input.price}) vs Harga Avg Broker (${input.avgPrice}). Jelaskan risikonya secara tajam.
  3. Berikan Rekomendasi Traffic Light Risk (Merah/Kuning/Hijau) dengan penjelasan teknis mengapa level tersebut dipilih.
  4. Tentukan Strategi: Day Trade (1-3 hari) atau Swing Trade (1-4 minggu).
  5. Estimasi Target Price (TP) dan Stop Loss (SL) yang disiplin.

  PENTING: JANGAN gunakan formatting Markdown seperti ###, **, atau ***. Tampilkan teks bersih, profesional, dan lugas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return (response.text || "").replace(/[#*]/g, '');
  } catch (error) {
    console.error("Error performing deep reasoning:", error);
    return "Terjadi kesalahan sistem saat menghubungi mesin AI.";
  }
}
