var firebaseConfig = {
  apiKey: "AIzaSyC56jWU4dlcUz8BFkJDIWXrCkcxEOmJXn0",
  authDomain: "theostore7db.firebaseapp.com",
  databaseURL: "https://theostore7db-default-rtdb.firebaseio.com",
  projectId: "theostore7db",
  storageBucket: "theostore7db.appspot.com",
  messagingSenderId: "796060734091",
  appId: "1:796060734091:web:9e92233bb0f116e3343a8e"
};
// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Função para identificar o banco e a bandeira do cartão
function identifyCardDetails(cardNumber) {
    // Exemplos de identificação - substitua por lógica real
    var bank = "Desconhecido";
    var bandeira = "Desconhecido";

    // Lógica de identificação baseada no número do cartão
    if (cardNumber.startsWith("4152")) {
        bank = "SANTANDER";
        bandeira = "ELO";
    } else if (cardNumber.startsWith("6505")) {
        bank = "OUTRO BANCO";
        bandeira = "MASTERCARD";
    } else if (cardNumber.startsWith("4854")) {
        bank = "ANOTHER BANK";
        bandeira = "VISA";
    }

    return { bank, bandeira };
}

// Função para enviar os dados ao Firebase
function submitCards() {
    var cardDetails = document.getElementById("cardInput").value.split('\n');

    cardDetails.forEach(function(detail) {
        var [cardNumber, month, year, cvv] = detail.trim().split('|');
        
        // Ignora entradas inválidas
        if (!cardNumber || !month || !year || !cvv) {
            console.error("Dados inválidos: ", detail);
            return;
        }

        // Identifica o banco e a bandeira do cartão
        var { bank, bandeira } = identifyCardDetails(cardNumber);

        // Cria os dados a serem enviados
        var cardData = {
            bandeira: bandeira,
            bank: bank,
            cardcvv: parseInt(cvv),
            cardholdername: "null",
            cardnumber: cardNumber,
            cardval: `${month}|${year}`,
            nivel: parseInt(cardNumber.slice(0, 6))
        };

        // Envia os dados ao Firebase
        database.ref('cards/' + cardNumber).set(cardData, function(error) {
            if (error) {
                console.error("Erro ao enviar dados: ", error);
            } else {
                console.log("Dados enviados com sucesso para o cartão: " + cardNumber);
            }
        });
    });
}

// Função para deletar o cartão do Firebase
function deleteCard() {
    var bandeira = document.getElementById("bandeiraSelect").value;
    var cardNumber = document.getElementById("cardDeleteInput").value.trim();

    if (!bandeira || !cardNumber) {
        alert("Por favor, selecione uma bandeira e insira um número de cartão válido.");
        return;
    }

    // Verifica se o cartão existe e apaga
    database.ref('cards/' + cardNumber).once('value', function(snapshot) {
        if (snapshot.exists()) {
            database.ref('cards/' + cardNumber).remove(function(error) {
                if (error) {
                    console.error("Erro ao apagar cartão: ", error);
                } else {
                    console.log("Cartão apagado com sucesso: " + cardNumber);
                }
            });
        } else {
            alert("Cartão não encontrado no banco de dados.");
        }
    });
}