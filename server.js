/*  ejs-> templet padrao do node
    express-> fremework do node
    socket.io-> comunicação back com front
*/

//import do express para nossas rotas
const express = require('express');

//padrao do node
const path = require('path');


const app = express();

//define o protocolo http da nossa aplicação em express
const server = require('http').createServer(app);

// protocolo wss para o websocket
const io = require('socket.io')(server);


//definindo a nossa pasta da aplicação
app.use(express.static(path.join(__dirname, 'public')));

//definindo nossas views
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// renderização do nosso index
app.use('/', (req, res) => {
    res.render('index.html');
});


//array contendo as nossas mensagens
let messages = [];


/*definindo o nosso tipo de comunicação
a cada pessoa que entrar no nosso socket ele ira mostrar a 
mensagem de Socket conectado
*/
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    //carregando todas as nossas mensagens do array para 
    //o novo socket conectado
    socket.emit('previousMessages', messages);


    //recebendo os dados da mensagem do front
    socket.on('sendMessage', data => {
        //console.log(data);
        messages.push(data);

        //enviando para todos os sockets conectados na aplicação
        socket.broadcast.emit('receivedMessage', data);
    });
});


//ouvindo na porta 3000
server.listen(3000)