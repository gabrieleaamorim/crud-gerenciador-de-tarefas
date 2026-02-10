import fs from 'node:fs';
import { parse } from 'csv-parse';
import http from 'node:http';

const csvFilePath = new URL('../tasks.csv', import.meta.url);

function createTask(title, description) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ title, description });

    const options = {
      hostname: 'localhost',
      port: 3333,
      path: '/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 201) {
        resolve();
      } else {
        reject(new Error(`Falha ao criar tarefa. Status: ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function importTasks() {
  const tasks = [];

  const parser = fs.createReadStream(csvFilePath).pipe(
    parse({
      columns: true, 
      skip_empty_lines: true,
      delimiter: ',',
    })
  );

  for await (const record of parser) {
    tasks.push(record);
  }

  console.log(`📋 Encontradas ${tasks.length} tarefas para importar...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const task of tasks) {
    try {
      await createTask(task.title, task.description);
      successCount++;
      console.log(`✅ Tarefa criada: ${task.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Erro ao criar tarefa "${task.title}": ${error.message}`);
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ ${successCount} tarefas importadas com sucesso`);
  if (errorCount > 0) {
    console.log(`   ❌ ${errorCount} tarefas falharam`);
  }
}

console.log('🚀 Iniciando importação de tarefas...\n');
console.log('⚠️  Certifique-se de que o servidor está rodando na porta 3333!\n');

importTasks().catch((error) => {
  if (error.code === 'ENOENT') {
    console.error('❌ Erro: Arquivo tasks.csv não encontrado!');
    console.log('💡 Crie um arquivo tasks.csv na raiz do projeto com o formato:');
    console.log('title,description');
    console.log('Minha tarefa 1,Descrição da tarefa 1');
    console.log('Minha tarefa 2,Descrição da tarefa 2');
  } else if (error.code === 'ECONNREFUSED') {
    console.error('❌ Erro: Não foi possível conectar ao servidor!');
    console.log('💡 Execute "npm run dev" em outro terminal para iniciar o servidor.');
  } else {
    console.error('❌ Erro ao importar tarefas:', error.message);
  }
  process.exit(1);
});
