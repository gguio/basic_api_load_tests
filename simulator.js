const axios = require('axios');

const config = {
    baseURL: 'http://localhost:3000/api/test', 
    users: 100, // кол-во виртуальных пользователей
    duration: 10, // время теста
    delayRange: [10, 5000], // диапазон задержек между запросами в мс
};

// метрики
let successCount = 0;
let errorCount = 0;
let errorDetails = {};
let responseTimes = [];

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendRequest(userId) {
    const delay = getRandomDelay(...config.delayRange);
    await new Promise(resolve => setTimeout(resolve, delay));

    const startTime = Date.now();

    try {
        let response
        if (Math.random() > 0.5) {
            response = await axios.post(config.baseURL, { data: `User ${userId} request` });
        } else {
        }
        const duration = Date.now() - startTime;
        
        responseTimes.push(duration);
        successCount++;
    } catch (error) {
        errorCount++;
        const status = error.response ? error.response.status : 'Network Error';
        errorDetails[status] = (errorDetails[status] || 0) + 1;
    }
}

async function runSimulation() {
    console.log(`Симуляция ${config.users} пользователей втечение ${config.duration} секунд...`);

    const startTime = Date.now();
    const endTime = startTime + config.duration * 1000 - config.delayRange[1];
    const userIntervals = [];

    for (let i = 0; i < config.users; i++) {
        const interval = setInterval(() => {
            if (Date.now() < endTime) {
                sendRequest(i);
            } else {
                clearInterval(interval);
            }
        }, getRandomDelay(...config.delayRange));

        userIntervals.push(interval);
    }

    setTimeout(() => {
        const totalTime = (Date.now() - startTime) / 1000;
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
        const bandwidth = (successCount + errorCount) / totalTime;

        // результат
        console.log('\nSimulation Results:');
        console.log(`Total Time: ${totalTime.toFixed(2)}s`);
        console.log(`Successful Requests: ${successCount}`);
        console.log(`Failed Requests: ${errorCount}`);
        console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`Bandwidth: ${bandwidth.toFixed(2)} requests/sec`);
        console.log(`Error Details:`, errorDetails);
    }, config.duration * 1000);
}

// запуск
runSimulation();


