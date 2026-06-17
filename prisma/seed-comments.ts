import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lista de comentários realistas para o script sortear
const frasesComentarios = [
  "Produto excelente, superou minhas expectativas!",
  "Chegou super rápido e muito bem embalado. Recomendo.",
  "Qualidade muito boa, vale cada centavo investido.",
  "Exatamente como na descrição e nas fotos. Muito satisfeito.",
  "Comprei para dar de presente e a pessoa simplesmente amou.",
  "Cumpre perfeitamente o que promete, muito útil.",
  "Sensacional! Recomendo de olhos fechados.",
  "Achei o material ok, pelo preço cobrado é um bom custo-benefício.",
  "Tive uma ótima experiência de compra na loja.",
  "Perfeito! Com certeza vou comprar mais vezes.",
  "Gostei bastante, a durabilidade parece ser ótima.",
  "Muito prático e bonito. Ficou perfeito aqui em casa."
];

async function main() {
  console.log('Iniciando a geração de comentários...');

  // Opcional: Limpa os comentários de produtos antes de rodar (evita duplicar testes)
  await prisma.productRatings.deleteMany({});
  console.log('Tabela ProductRatings limpa.');

  // 1. Busca todos os usuários do banco para agirem como "clientes"
  const usuarios = await prisma.users.findMany();
  if (usuarios.length === 0) {
    console.error('Nenhum usuário encontrado para fazer os comentários!');
    return;
  }

  // 2. Busca todas as lojas com seus produtos, ordenados pelo ID
  const stores = await prisma.stores.findMany({
    include: {
      product: {
        orderBy: { id: 'asc' }
      }
    }
  });

  // A sua regra de negócios de quantidade de comentários por posição do produto
  const regraComentarios = [24, 16, 8, 4];

  // 3. Itera sobre cada loja e seus produtos
  for (const store of stores) {
    const produtos = store.product;

    for (let i = 0; i < produtos.length; i++) {
      const produto = produtos[i];
      
      // Se o índice for menor que 4, pega a quantidade da regra, senão é 0
      const qtdComentarios = i < regraComentarios.length ? regraComentarios[i] : 0;

      if (qtdComentarios === 0) continue;

      console.log(`Inserindo ${qtdComentarios} comentários no produto ID ${produto.id} (${produto.name})`);

      // 4. Cria os comentários para este produto
      for (let c = 0; c < qtdComentarios; c++) {
        // Sorteia um usuário aleatório
        const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];
        
        // Sorteia uma frase de comentário
        const comentarioAleatorio = frasesComentarios[Math.floor(Math.random() * frasesComentarios.length)];
        
        // Sorteia uma nota entre 3 e 5
        const notaAleatoria = Math.floor(Math.random() * 3) + 3;

        await prisma.productRatings.create({
          data: {
            user_id: usuarioAleatorio.id,
            product_id: produto.id,
            rating: notaAleatoria,
            comment: comentarioAleatorio
          }
        });
      }
    }
  }

  console.log('✅ Todos os comentários foram gerados e inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao popular os comentários:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Finalizado.');
  });