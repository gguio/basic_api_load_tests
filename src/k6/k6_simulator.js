import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// максимальная рандомная задержка между запросами
const delay = 5;

export const options = {
    stages: [
        { duration: '2m', target: 500 },
        { duration: '10m', target: 500 },
        { duration: '2m', target: 0 }
    ]
};

// метрики
const responseTimeTrend = new Trend('response_time');
const successCount = new Counter('success_count');
const errorCount = new Counter('error_count');

// тест
export default function () {
    const payload = JSON.stringify({ data: `User request` });
    const headers = { 'Content-Type': 'application/json' };

    let res
    if (Math.random() > 0.5) {
        res = http.post('https://gguio.org/api/test', payload, { headers });
    } else {
        res = http.get('https://gguio.org/api/test', { headers });
    }

    responseTimeTrend.add(res.timings.duration);

    if (res.status === 200) {
        successCount.add(1);
    } else {
        errorCount.add(1);
    }

    check(res, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(Math.random() * delay);
}

// Резултаты теста
export function handleSummary(data) {
    return {
        stdout: `
        Simulation Results:
        ---------------------------
        Total Requests: ${data.metrics.iterations.values.count}
        Successful Requests: ${data.metrics.success_count ? data.metrics.success_count.values.count : 0}
        Failed Requests: ${data.metrics.error_count ? data.metrics.error_count.values.count : 0}
        
        Response Times (ms):
          - Avg: ${data.metrics.response_time.values.avg.toFixed(2)}
          - Min: ${data.metrics.response_time.values.min}
          - Max: ${data.metrics.response_time.values.max}
          - p95: ${data.metrics.response_time.values['p(95)']}
        
        Bandwidth: ${(data.metrics.iterations.values.count / (data.state.testRunDurationMs / 1000)).toFixed(2)} req/sec
        `,
    };
}

