import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando a geração automática de imagens...');

  // Opcional: Limpa a tabela de imagens antes de rodar para evitar duplicações 
  // caso você precise rodar este script mais de uma vez.
  await prisma.productImages.deleteMany({});
  console.log('Tabela ProductImages limpa para receber os novos dados.');

  // 1. Busca todas as lojas e inclui os produtos delas
  const stores = await prisma.stores.findMany({
    include: {
      product: {
        orderBy: { id: 'asc' } // Garante que a ordem dos produtos seja sempre a mesma
      }
    }
  });

  // 2. Itera sobre cada loja
  for (const store of stores) {
    const produtos = store.product;

    if (produtos.length === 0) continue;

    console.log(`Processando imagens da loja: ${store.name}`);

    // 3. Itera sobre os produtos da loja atual
    for (let i = 0; i < produtos.length; i++) {
      const produto = produtos[i];
      
      // Regra de negócio: 4 imagens se for o primeiro produto (índice 0), senão 1 imagem
      const quantidadeImagens = i === 0 ? 4 : 1;

      // 4. Cria os registros na tabela ProductImages
      for (let ordem = 1; ordem <= quantidadeImagens; ordem++) {
        
        // A URL do Picsum usa um 'seed' único para que a foto gerada não mude toda vez 
        // que a página for recarregada no seu front-end.
        const imageUrl = `https://picsum.photos/seed/produto_${produto.id}_img_${ordem}/600/600`;

        await prisma.productImages.create({
          data: {
            product_id: produto.id,
            image_url: imageUrl,
            order: ordem
          }
        });
      }
    }
  }

  console.log('✅ Todas as imagens foram vinculadas aos produtos com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao popular as imagens:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Finalizado.');
  });