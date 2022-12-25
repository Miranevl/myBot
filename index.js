const telegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions} = require('./options.js');

const token = '5815351555:AAHvXXhjAIg-XndzUJczZ1E63wPw7HITu24';

const bot = new telegramApi(token, {polling : true});

const chats = {};

const startGame = async (chatId) => {   
    await bot.sendMessage(chatId,`Сейчас я загадаю тебе число от 0 до 9, а ты попробуй угадать`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие!'},
        {command: '/info', description: 'Информация о тебе'},
        {command: '/game', description: 'Игра - угадайка'},
    ])
    
    bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if(text === '/start'){
        await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/8.webp');
        return bot.sendMessage(chatId, `Добро пожаловать в личного бота!`);
    }
    
    if(text === '/info'){
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }
    if(text === '/game'){
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Не поняль(');
    })
}

bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again'){
        return startGame(chatId);
    }
    if(data === chats[chatId]){
        return bot.sendMessage(chatId, `Ты угадал ${msg.from.first_name} , верная цифра ${chats[chatId]}!`, againOptions);
    }else{
        return bot.sendMessage(chatId,`К сожалению ${msg.from.first_name} не угадал цифру, верная цифра ${chats[chatId]}`,AgainOptions)
    }
})

start();