/* Quest Kids — configuração do app.
   Só chaves PÚBLICAS aqui. Nunca coloque a secret key do Stripe, a service_role do Supabase
   nem a chave da IA neste arquivo: essas ficam em Supabase → Edge Functions → Secrets. */
window.QK_CONFIG = {
  SUPABASE_URL: 'https://wqpujoymslyajknpkdpe.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_YkSW55PojAbLpr8hCcLb5Q_5PKgBbSL',
  SUPORTE_EMAIL: 'rodrigok4455@gmail.com',
  TESTE_DIAS: 7,
  GOOGLE_LOGIN: false,      // ligue o Google em Supabase → Authentication → Providers
  APPLE_LOGIN: false       // reservado para depois
};
