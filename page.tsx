'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CreateArticlePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1️⃣ Pega o usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('Você precisa estar logado para publicar.');
      setLoading(false);
      return;
    }

    // 2️⃣ Insere o artigo no Supabase
    const { data, error: insertError } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        owner_id: user.id,
        published_at: null, // define null se não quiser publicar ainda
      });

    if (insertError) {
      setError('Erro ao criar o artigo: ' + insertError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Redireciona para a página de artigos
    router.push('/dashboard/articles');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Criar Artigo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Conteúdo do artigo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

