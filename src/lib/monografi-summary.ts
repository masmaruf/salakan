interface MonografiData {
  identitasDukuh: {
    namaDukuh: string;
    pendidikan: string;
    alamat: string;
  };
  demografi: {
    luasWilayah: string;
    jumlahRT: number;
    totalJiwa: number;
    totalLakiLaki: number;
    totalPerempuan: number;
    totalKK: number;
    kkLakiLaki: number;
    kkPerempuan: number;
  };
  fasilitas: {
    pendidikan: Record<string, string>;
    kesehatan: Record<string, string>;
  };
  potensi: {
    seniBudaya: string[];
    umkmIndustri: string[];
  };
}

function countFilledValues(record: Record<string, string>) {
  return Object.values(record).filter((value) => value && value !== '-').length;
}

export function getMonografiSummary(monografi: MonografiData | null) {
  if (!monografi) {
    return {
      totalKK: 0,
      totalJiwa: 0,
      jumlahRT: 0,
      totalPotensi: 0,
      fasilitasPendidikan: 0,
      fasilitasKesehatan: 0,
    };
  }

  return {
    totalKK: monografi.demografi.totalKK,
    totalJiwa: monografi.demografi.totalJiwa,
    jumlahRT: monografi.demografi.jumlahRT,
    totalPotensi: monografi.potensi.seniBudaya.length + monografi.potensi.umkmIndustri.length,
    fasilitasPendidikan: countFilledValues(monografi.fasilitas.pendidikan),
    fasilitasKesehatan: countFilledValues(monografi.fasilitas.kesehatan),
  };
}
