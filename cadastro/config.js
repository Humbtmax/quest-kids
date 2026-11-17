/* =========================================================
   Quest Kids — configuração do cadastro
   Preencha com os dados do projeto NOVO do Supabase (não o da Gabi).
   ⚠️ Use só a chave "anon / public". NUNCA a "service_role".
   ========================================================= */
window.QK_CONFIG = {
  // Supabase → Project Settings → API
  SUPABASE_URL: 'https://wqpujoymslyajknpkdpe.supabase.co',          // ex.: 'https://abcdefgh.supabase.co'
  SUPABASE_ANON_KEY: 'sb_publishable_YkSW55PojAbLpr8hCcLb5Q_5PKgBbSL',     // a chave "anon public"

  // EmailJS (o mesmo que você já usa no app da Gabi) → Account → Public Key
  EMAILJS_PUBLIC_KEY: 'gWJrTRHYNAc7j_mUm',
  EMAILJS_SERVICE_ID: 'service_5xp1au9',            // ex.: 'service_xxxxx'
  EMAILJS_TEMPLATE_AVISO: 'template_q6ugj0y',        // modelo que avisa VOCÊ de um cadastro novo
  EMAILJS_TEMPLATE_CONFIRMA: '',     // vazio: o plano grátis do EmailJS só tem 2 modelos (o outro é do app da Gabi). A confirmação aparece na tela.

  // Limites dos arquivos enviados
  MAX_ARQUIVOS: 30,
  MAX_MB: 50,          // por arquivo (o limite do Supabase grátis é 50 MB por arquivo)
  MAX_TOTAL_MB: 100,   // soma de todos os arquivos de um cadastro

  // Nome que aparece para os pais
  NOME_CONTATO: 'Paula'
};
