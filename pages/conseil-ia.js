import Head from 'next/head';
import AIConsultation from '../components/AIConsultation';

export default function AIConsultationPage() {
  return (
    <>
      <Head>
        <title>Conseil IA Personnalisé - RASHAQA</title>
        <meta name="description" content="Obtenez des conseils personnalisés grâce à notre IA pour votre alimentation et votre bien-être" />
      </Head>
      
      <main className="min-h-screen bg-gray-50">
        <AIConsultation />
      </main>
    </>
  );
}
