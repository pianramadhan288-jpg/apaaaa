
import { BrokerCategory, BrokerInfo } from './types';

export const BROKER_DB: Record<string, BrokerInfo> = {
  // Rich/Kuat (Asing/Institusi)
  'CS': { code: 'CS', name: 'Credit Suisse', category: BrokerCategory.RICH, description: 'Rich asing top – Bagus jangka panjang, rally stabil blue chip.' },
  'MS': { code: 'MS', name: 'Morgan Stanley', category: BrokerCategory.RICH, description: 'Rich asing US – Bagus jangka menengah, naik gila tech/komoditas.' },
  'UB': { code: 'UB', name: 'UBS Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing Swiss – Bagus jangka panjang, stabil aman.' },
  'BK': { code: 'BK', name: 'J.P. Morgan', category: BrokerCategory.RICH, description: 'Rich asing US – Bagus jangka panjang, duit banjir masuk.' },
  'AK': { code: 'AK', name: 'UBS Patungan', category: BrokerCategory.RICH, description: 'Rich asing – Bagus kalau net buy bareng BK, jebakan kalau bergantian.' },
  'YP': { code: 'YP', name: 'Mirae Asset', category: BrokerCategory.RICH, description: 'Rich asing Korea – Bagus jangka menengah, sering asing pro.' },
  'ZP': { code: 'ZP', name: 'MNC Sekuritas', category: BrokerCategory.RICH, description: 'Rich institusi lokal – Bagus jangka pendek-menengah, bandar kuat.' },
  'HD': { code: 'HD', name: 'KGI Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing patungan – Bagus jangka menengah.' },
  'RX': { code: 'RX', name: 'RHB Sekuritas', category: BrokerCategory.RICH, description: 'Rich akumulasi diam – Bagus jangka panjang, akumulasi terbaik.' },
  'DU': { code: 'DU', name: 'Deutsche Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing Jerman – Bagus jangka panjang, jarang tapi powerful.' },
  'CG': { code: 'CG', name: 'CGS-CIMB Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing Malaysia – Bagus jangka menengah.' },
  'KZ': { code: 'KZ', name: 'CLSA Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing global – Bagus jangka panjang, riset top.' },
  'DR': { code: 'DR', name: 'Danareksa Sekuritas', category: BrokerCategory.RICH, description: 'Rich institusi BUMN – Bagus jangka menengah, kalau net buy kuat.' },
  'LH': { code: 'LH', name: 'Lautandhana Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing patungan – Bagus jangka menengah.' },
  'AH': { code: 'AH', name: 'Andalan Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing patungan – Bagus kalau net buy.' },
  'GW': { code: 'GW', name: 'Golden Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing patungan – Bagus jangka menengah.' },
  'RB': { code: 'RB', name: 'RHB Sekuritas Lain', category: BrokerCategory.RICH, description: 'Rich asing – Bagus akumulasi.' },
  'TP': { code: 'TP', name: 'Trimegah Sekuritas', category: BrokerCategory.RICH, description: 'Rich institusi – Bagus jangka menengah.' },
  'KK': { code: 'KK', name: 'Kresna Sekuritas', category: BrokerCategory.RICH, description: 'Rich institusi – Bagus pendek-menengah.' },
  'LS': { code: 'LS', name: 'Laurent Sekuritas', category: BrokerCategory.RICH, description: 'Rich asing patungan – Bagus jangka menengah.' },

  // Konglo Spesial
  'HP': { code: 'HP', name: 'Henan Putihrai', category: BrokerCategory.KONGLO, description: 'Konglo Prajogo – Bagus jangka pendek-menengah di grup (BRPT dll), naik gila.' },
  'DX': { code: 'DX', name: 'Danareksa Khusus', category: BrokerCategory.KONGLO, description: 'Konglo Prajogo – Angkat harga grup.' },
  'LG': { code: 'LG', name: 'Trimegah Khusus', category: BrokerCategory.KONGLO, description: 'Konglo Hapsoro – Bagus rebound di saham grup (RAJA dll).' },
  'MU': { code: 'MU', name: 'Multi Sekuritas', category: BrokerCategory.KONGLO, description: 'Konglo Hapsoro – Jaga harga.' },
  'ES': { code: 'ES', name: 'Eka Sari Sekuritas', category: BrokerCategory.KONGLO, description: 'Konglo Hapsoro – Potensi naik cepat.' },

  // Ritel
  'XL': { code: 'XL', name: 'Stockbit Sekuritas', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus jangka panjang, FOMO pendek koreksi cepat.' },
  'XC': { code: 'XC', name: 'Ajaib Sekuritas', category: BrokerCategory.AMPAS, description: 'Ritel pemula – Ga bagus, hype cepat anjlok.' },
  'PD': { code: 'PD', name: 'Indo Premier', category: BrokerCategory.AMPAS, description: 'Ritel campur – Ga bagus jangka panjang, FOMO.' },
  'CC': { code: 'CC', name: 'Mandiri Sekuritas', category: BrokerCategory.AMPAS, description: 'Cuci gudang – Ga bagus, internal jebakan.' },
  'CP': { code: 'CP', name: 'Ciptadana', category: BrokerCategory.AMPAS, description: 'Ritel campur – Ga bagus, FOMO pendek.' },
  'NI': { code: 'NI', name: 'NH Korindo', category: BrokerCategory.AMPAS, description: 'Ritel kecil – Ga bagus, gerombolan panik.' },
  'IF': { code: 'IF', name: 'IF Sekuritas', category: BrokerCategory.AMPAS, description: 'Cuci piring – Ga bagus, distribusi ke ritel.' },
  'BB': { code: 'BB', name: 'Binaartha Sekuritas', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus, panik jual/beli.' },
  'SS': { code: 'SS', name: 'Surya Sekuritas', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus, FOMO.' },
  'BQ': { code: 'BQ', name: 'Binaartha Ritel', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'GR': { code: 'GR', name: 'Genta Sekuritas', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'SA': { code: 'SA', name: 'Surya Ampas', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'SC': { code: 'SC', name: 'Surya Cipta', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'SF': { code: 'SF', name: 'Surya Fajar', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'SH': { code: 'SH', name: 'Surya Hapsoro', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'SQ': { code: 'SQ', name: 'Surya Q', category: BrokerCategory.AMPAS, description: 'Campur tapi sering ritel.' },
  'TF': { code: 'TF', name: 'Tiga Fajar', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'TS': { code: 'TS', name: 'Tiga Surya', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'TX': { code: 'TX', name: 'Tiga X', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'XA': { code: 'XA', name: 'X Ajaib', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'YB': { code: 'YB', name: 'Y Bina', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'YJ': { code: 'YJ', name: 'Y Jaya', category: BrokerCategory.AMPAS, description: 'Campur ritel.' },
  'YO': { code: 'YO', name: 'Y Oke', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },
  'ZR': { code: 'ZR', name: 'ZR Sekuritas', category: BrokerCategory.AMPAS, description: 'Ritel – Ga bagus.' },

  // Campur
  'AD': { code: 'AD', name: 'Andalan', category: BrokerCategory.CAMPUR, description: 'Campur ritel/institusi.' },
  'AF': { code: 'AF', name: 'Asia Fajar', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AG': { code: 'AG', name: 'Asia Genta', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AI': { code: 'AI', name: 'Asia Indo', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AJ': { code: 'AJ', name: 'Asia Jaya', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AN': { code: 'AN', name: 'Asia Nusantara', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AO': { code: 'AO', name: 'Asia Oke', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AP': { code: 'AP', name: 'Asia Prima', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AR': { code: 'AR', name: 'Asia Raya', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'AZ': { code: 'AZ', name: 'Asia Z', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'BF': { code: 'BF', name: 'Bina Fajar', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'BS': { code: 'BS', name: 'Bina Surya', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'BZ': { code: 'BZ', name: 'Bina Z', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'DD': { code: 'DD', name: 'Dinar D', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'DM': { code: 'DM', name: 'Dinar M', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'DP': { code: 'DP', name: 'Dinar P', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'EL': { code: 'EL', name: 'Eka L', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'FO': { code: 'FO', name: 'Fajar O', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'FS': { code: 'FS', name: 'Fajar S', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'FZ': { code: 'FZ', name: 'Fajar Z', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'IC': { code: 'IC', name: 'Indo C', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'ID': { code: 'ID', name: 'Indo D', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'IH': { code: 'IH', name: 'Indo H', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'II': { code: 'II', name: 'Indo I', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'IN': { code: 'IN', name: 'Indo N', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'IT': { code: 'IT', name: 'Indo T', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'IU': { code: 'IU', name: 'Indo U', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'JB': { code: 'JB', name: 'Jaya B', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'KI': { code: 'KI', name: 'Kresna I', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'KS': { code: 'KS', name: 'Kresna S', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'MI': { code: 'MI', name: 'Multi I', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'MK': { code: 'MK', name: 'Multi K', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'OD': { code: 'OD', name: 'Oke D', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'OK': { code: 'OK', name: 'Oke K', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PC': { code: 'PC', name: 'Prima C', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PF': { code: 'PF', name: 'Prima F', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PG': { code: 'PG', name: 'Prima G', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PI': { code: 'PI', name: 'Prima I', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PO': { code: 'PO', name: 'Prima O', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PP': { code: 'PP', name: 'Prima P', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'PS': { code: 'PS', name: 'Prima S', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'RG': { code: 'RG', name: 'Raya G', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'RO': { code: 'RO', name: 'Raya O', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'RS': { code: 'RS', name: 'Raya S', category: BrokerCategory.CAMPUR, description: 'Campur.' },
  'YU': { code: 'YU', name: 'YU Sekuritas', category: BrokerCategory.CAMPUR, description: 'Campur (Kadang Konglo).' },
  'KAF': { code: 'KAF', name: 'K A F Sekuritas', category: BrokerCategory.CAMPUR, description: 'Campur ritel.' },
};

export const SIGNAL_TEMPLATES = [
  {
    // + OB ideal + Big Acc Rich + Trade Buy
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Buy Dominan' && richAcc && input.tradeBook === 'Buy Dominan',
    text: "Super mantap buy besok pagi. Potensi gap up atau naik kuat (bandar + buyer agresif menang total, momentum bullish penuh)."
  },
  {
    // - OB ask tebal + Big Dist + Trade Sell
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Sell Dominan' && input.brokerSummary <= 40 && input.tradeBook === 'Sell Dominan',
    text: "Skip buy atau sell/short besok. Potensi turun lanjut atau anjlok (distribusi + seller hajar, bearish kuat)."
  },
  {
    // + OB bid tebal + Big Acc Rich + Trade Sell
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Buy Dominan' && richAcc && input.tradeBook === 'Sell Dominan',
    text: "Masih bagus buy besok (prioritas Big Acc). Potensi rebound atau naik (bandar borong murah hari ini pas seller tekan, akumulasi tersembunyi)."
  },
  {
    // - OB bid tipis + Big Dist + Trade Buy
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Buy Dominan' && input.brokerSummary <= 40 && input.tradeBook === 'Buy Dominan',
    text: "Waspada, skip buy besok. Potensi turun atau sideways (distribusi kuat, buy hari ini cuma FOMO sementara, ga ada backup)."
  },
  {
    // + OB bid tebal + Big Acc Ritel + Trade Buy
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Buy Dominan' && !richAcc && input.brokerSummary >= 60 && input.tradeBook === 'Buy Dominan',
    text: "Bagus pendek aja, buy besok tapi siap sell cepat. Potensi naik open, tapi koreksi sore (FOMO ritel, ga kuat jangka panjang)."
  },
  {
    // - OB ask tebal + Big Acc + Trade Sell
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Sell Dominan' && input.brokerSummary >= 60 && input.tradeBook === 'Sell Dominan',
    text: "Konflik, skip buy besok. Potensi sideways atau turun (akumulasi lemah, seller tekan harga)."
  },
  {
    // + OB ideal + Netral + Trade Buy
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Buy Dominan' && input.brokerSummary > 40 && input.brokerSummary < 60 && input.tradeBook === 'Buy Dominan',
    text: "Lumayan buy besok. Potensi naik pendek (momentum buyer hari ini, tapi ga ada akumulasi kuat)."
  },
  {
    // - OB ask dominan + Big Acc Rich + Trade Sell
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Sell Dominan' && richAcc && input.tradeBook === 'Sell Dominan',
    text: "Bagus buy besok kalau rich broker kuat. Potensi rebound (bandar manfaatin seller buat borong murah)."
  },
  {
    // + OB bid tebal freq rendah + Big Acc Rich + Trade Netral
    condition: (input: any, richAcc: boolean) => input.orderBook === 'Buy Dominan' && richAcc && input.tradeBook === 'Buy Dominan', // Simplified
    text: "Mantap hold/buy besok. Potensi naik stabil menengah (bandar backup solid)."
  },
  {
    condition: (input: any, richAcc: boolean) => true,
    text: "Skip buy besok, tunggu konfirmasi. Potensi sideways atau volatile (ga ada sinyal kuat)."
  }
];
