import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listas para gerar nomes aleatórios
const nomes = ["Ana", "João", "Daniel", "Leonardo", "Felipe","Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Julia", "Lucas", "Mariana", "Nicolas", "Olivia", "Pedro", "Quintino", "Rafael", "Sofia", "Tiago", "Ursula", "Vinicius", "Vitoria", "Wagner", "Yasmin", "Zeca"];
const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa"];

async function main() {
  console.log('Iniciando a criação de 50 usuários aleatórios...');

  for (let i = 1; i <= 75; i++) {
    // Sorteia um nome e um sobrenome
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    
    const nomeCompleto = `${nome} ${sobrenome}`;
    
    // Cria um username único (ex: ana.silva.42)
    const username = `${nome.toLowerCase()}.${sobrenome.toLowerCase()}.${i}${Math.floor(Math.random() * 100)}`;
    
    // Cria um email único
    const email = `${username}@email.com`;

    // Gera uma URL de avatar baseada no username
const avatarUrl = `https://ui-avatars.com/api/?name=${nome}+${sobrenome}&background=random&color=fff&size=150`;
    await prisma.users.create({
      data: {
        name: nomeCompleto,
        username: username,
        email: email,
        password_hash: '$2b$10$s2jPM/y3qNcjMd1WeEA./uSc0jcbRolAZYTGjtwmNCJC425X9Iomy', // Enviando a senha padrão em texto plano conforme solicitado
        profile_picture_url: avatarUrl
      }
    });

    console.log(`Usuário ${i}/50 criado: ${username}`);
  }

  console.log('✅ 50 usuários criados com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao criar usuários:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Finalizado.');
  });