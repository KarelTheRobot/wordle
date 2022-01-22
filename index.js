const { Client, Intents, RichPresenceAssets } = require('discord.js');
const { token } = require('./config.json');
const seedrandom = require('seedrandom');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
    console.log('ready');
});


const word_starts = {
    '1': 0,
    '2': 26,
    '3': 453,
    '4': 2583,
    '5': 9769,
    '6': 25687,
    '7': 55561,
    '8': 97559,
    '9': 149186,
    '10': 202588,
    '11': 248460,
    '12': 285999,
    '13': 315124,
    '14': 336068,
    '15': 350217,
    '16': 359063,
    '17': 364245,
    '18': 367212,
    '19': 368683,
    '20': 369443,
    '21': 369802,
    '22': 369970,
    '23': 370044,
    '24': 370075,
    '25': 370087,
    '26': 370095,
    '27': 370095,
    '28': 370098,
    '29': 370100,
    '30': 370102,
};

function get_line(filename, line_no) {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split('\n');

    if (+line_no > lines.length) {
        throw new Error('File end reached');
    }

    return lines[+line_no];
}

function getCurrentNumber() {
    const today = new Date();
    console.log("today", today);
    const startDate = new Date(2022, 0, 8);
    console.log(startDate);
    today.setMinutes(0, 0, 0);
    console.log(today);
    const delta = today - startDate;
    console.log("delta", delta);
    const number = delta / (1000 * 60 * 60);

    return number;
}

function getCurrentWord(length) {
    if (length < 3 || length > 30) {
        return '';
    } else {
        const today = new Date();
        const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay() + '-' + today.getHours();

        console.log(date);

        const rng = seedrandom(date);

        const rand_val = rng();

        const acceptable_min = word_starts['' + length];
        const acceptable_max = word_starts['' + (length + 1)];

        const index = Math.floor(rand_val * (acceptable_max - acceptable_min) + acceptable_min);
        return get_line('words_sorted.txt', index);
    }
}

function evaluateGuess(guess) {
    const curr_word = getCurrentWord(5);
    console.log('current_word: ' + curr_word);

    if (guess.length != 5) {
        return {};
    }
    const curr_word_split = curr_word.split('');
    // console.log("split:", curr_word_split);

    const guess_split = guess.split('');

    const result = {

    };
    let i = 0;
    for (; i < curr_word_split.length; i++) {
        result[i] = 0;
    }

    console.log(result);

    for (i = 0; i < curr_word_split.length; i++) {
        if (curr_word_split[i] === guess_split[i]) {
            result[i] = 2;
            curr_word_split[i] = '';
            guess_split[i] = '';
        }
    }

    console.log(result);

    for (i = 0; i < guess_split.length; i++) {
        if (guess_split[i] == '') {
            continue;
        }
        if (curr_word_split.indexOf(guess_split[i]) > -1) {
            const index = curr_word_split.indexOf(guess_split[i]);
            curr_word_split[index] = '';
            result[i] = 1;
        }
    }

    console.log(result);

    return result;
}

function respondToGuess(guess) {
    const result = evaluateGuess(guess);
    if (Object.keys(result).length == 0) {
        return "error";
    }
    let s = '';
    for (let i = 0; i < Object.keys(result).length; i++) {
        console.log(i);
        if (result[i] == 2) {
            s += '🟩';
        } else if (result[i] == 1) {
            s += '🟨';
        } else {
            s += '⬛';
        }
    }
    console.log(s);
    return s;
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'guess') {
        try {
            let guess = interaction.options.getString('guess');
            if (guess == null) {
                reply("error");
            } else {
                console.log(guess);
            }
            let response = respondToGuess(guess);

            await interaction.reply(response);
        } catch (e) {
            await interaction.reply("error");
            console.log("error: guess = ", interaction.options.getString('guess'));
        }
    } else if (commandName === 'current') {
        let response = "Word #" + getCurrentNumber();
        await interaction.reply(response);
    }
});

client.login(token);