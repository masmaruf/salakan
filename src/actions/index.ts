import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  layanan: {
    ajukanSurat: defineAction({
      accept: 'form',
      input: z.object({
        jenis_surat: z.string().min(1, "Pilih jenis surat"),
        keperluan: z.string().min(10, "Keterangan keperluan minimal 10 karakter"),
        whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid"),
        dokumen_pendukung: z.any().optional(), // Bisa dikembangkan untuk file upload
      }),
      handler: async (input) => {
        // Simulasi delay proses backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("Menerima pengajuan surat:", input);
        
        // Di fase selanjutnya, data ini akan dikirim ke Supabase atau Google Sheets
        return {
          success: true,
          message: "Pengajuan berhasil dikirim! Silakan pantau status di dasbor.",
          ticket: "SLK-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        };
      },
    }),
  },
};
