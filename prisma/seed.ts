import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, 'dados_lojas.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const lojasData = JSON.parse(rawData);

  console.log('Iniciando a injeção de categorias e produtos...');

  for (const lojaInfo of lojasData) {
    // 1. Busca a loja que JÁ EXISTE no seu banco de dados pelo nome
    const store = await prisma.stores.findFirst({
      where: { name: lojaInfo.nome_loja }
    });

    // Se a loja não existir, ele avisa e pula para a próxima
    if (!store) {
      console.log(`⚠️ Loja '${lojaInfo.nome_loja}' não encontrada no banco. Pulando...`);
      continue; 
    }

    // 2. Verifica/Cria a Categoria Pai (Ex: "Informática")
    let categoriaPai = await prisma.categories.findFirst({
      where: { name: lojaInfo.categoria_pai, parent_category_id: null }
    });
    
    if (!categoriaPai) {
      categoriaPai = await prisma.categories.create({
        data: { name: lojaInfo.categoria_pai }
      });
    }

    // 3. Criar as Subcategorias e os Produtos
    for (const sub of lojaInfo.subcategorias) {
      // Verifica/Cria Subcategoria vinculada à Categoria Pai
      let subcategoria = await prisma.categories.findFirst({
        where: { name: sub.nome, parent_category_id: categoriaPai.id }
      });

      if (!subcategoria) {
        subcategoria = await prisma.categories.create({
          data: { 
            name: sub.nome, 
            parent_category_id: categoriaPai.id 
          }
        });
      }

      // Inserir os Produtos vinculados à Loja EXISTENTE e à Subcategoria
      for (const prod of sub.produtos) {
        await prisma.products.create({
          data: {
            name: prod.nome,
            description: prod.descricao,
            price: prod.preco,
            stock: prod.quantidade,
            store_id: store.id, // Usa o ID da loja que ele encontrou no passo 1
            category_id: subcategoria.id 
          }
        });
      }
    }
    console.log(`✅ Produtos injetados com sucesso na loja: '${lojaInfo.nome_loja}'!`);
  }
}

main()
  .catch((e) => {
    console.error('Erro ao popular o banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Finalizado.');
  });