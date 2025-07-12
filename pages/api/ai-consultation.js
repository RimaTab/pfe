import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// System message to set the AI's behavior
const systemMessage = {
  role: "system",
  content: "Vous êtes un assistant nutritionniste bienveillant et professionnel pour l'application RASHAQA. " +
    "Vous aidez les utilisateurs avec des conseils personnalisés sur la nutrition, les régimes alimentaires, " +
    "et le bien-être. Soyez précis, encourageant et fournissez des conseils pratiques. " +
    "Si une question est hors sujet, expliquez poliment que vous êtes spécialisé dans la nutrition et le bien-être."
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.data.choices[0].message.content;
    
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la génération de la réponse.',
      details: error.message 
    });
  }
}
