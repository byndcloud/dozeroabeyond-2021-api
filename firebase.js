const admin = require("firebase-admin");
const fs = require("fs");

if (fs.existsSync("./firebase-service-account.json") === false) {
  throw new Error(
    `Adicione o JSON da Service Account do seu projeto do Firebase!
  Acesse as Configurações do Projeto no Firebase, vá em Contas de Serviço, clique em Criar Conta de Serviço, gere uma chave, baixe ela, depois coloque nesse repositório com o nome firebase-servicea-account.json
  Link: https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk`
  );
}

const serviceAccount = require("./firebase-service-account.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  firestore: admin.firestore(app)
}