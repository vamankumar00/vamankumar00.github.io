// WebSocket State
let wsConnected = true;
let messageCount = 0;
let tickerInterval, chartInterval, priceInterval;

// Default JSON values for copying
const jsonDefaults = {
    'last-trade': `{
  "symbol": "MEBL",
  "price": 112539.17,
  "change": 0.25,
  "change_percent": 1.01,
  "volume": 4123123,
  "time": "09:59 AM"
}`,
    'quote': `{
  "symbol": "MEBL",
  "bid": {
    "price": 18.61,
    "size": 1030
  },
  "ask": {
    "price": 18.61,
    "size": 175
  },
  "spread": 0.00
}`,
    'depth': `{
  "symbol": "MEBL",
  "bids": [
    {"price": 18.61, "size": 1030},
    {"price": 18.60, "size": 1500}
  ],
  "asks": [
    {"price": 18.61, "size": 175},
    {"price": 18.62, "size": 200}
  ]
}`
};

// WebSocket Functions
function connectWebSocket() {
    wsConnected = true;
    document.getElementById('wsLed').className = 'ws-led connected';
    document.getElementById('wsStatus').textContent = 'WEBSOCKET CONNECTED';
    addConsoleMessage('SYSTEM', 'WebSocket connected successfully');
    startLiveData();
}

function disconnectWebSocket() {
    wsConnected = false;
    document.getElementById('wsLed').className = 'ws-led';
    document.getElementById('wsStatus').textContent = 'WEBSOCKET DISCONNECTED';
    addConsoleMessage('SYSTEM', 'WebSocket disconnected');
    
    if (tickerInterval) clearInterval(tickerInterval);
    if (chartInterval) clearInterval(chartInterval);
    if (priceInterval) clearInterval(priceInterval);
}

function subscribeMarket() {
    addConsoleMessage('MARKET', 'Subscribed to MEBL, PSO, HUBC');
}

function subscribeOrders() {
    addConsoleMessage('ORDERS', 'Subscribed to order updates for account A12345678');
}

function addConsoleMessage(type, data) {
    const container = document.getElementById('wsMessages');
    if (!container) return;
    
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'console-message';
    msgDiv.innerHTML = `
        <span class="msg-time">${timeStr}</span>
        <span class="msg-type">${type}</span>
        <span class="msg-data">${data}</span>
    `;
    
    container.insertBefore(msgDiv, container.firstChild);
    
    while (container.children.length > 20) {
        container.removeChild(container.lastChild);
    }
    
    messageCount++;
    updateLatency();
}

function clearConsole() {
    document.getElementById('wsMessages').innerHTML = '';
}

function updateLatency() {
    const latencyEl = document.getElementById('wsLatency');
    if (latencyEl) {
        const latency = 8 + Math.floor(Math.random() * 15);
        latencyEl.textContent = latency + 'ms';
    }
}

// Live Data Functions
function startLiveData() {
    // Update ticker/chart every 3 seconds
    tickerInterval = setInterval(() => {
        generateChart();
        updateOrderBook();
        addConsoleMessage('TRADE', `MEBL: ${(112500 + Math.random() * 100).toFixed(2)} (${Math.floor(Math.random() * 5000)} shares)`);
    }, 3000);
    
    // Update price every 2 seconds
    priceInterval = setInterval(() => {
        updatePrice();
    }, 2000);
}

function generateChart() {
    const chart = document.getElementById('candleChart');
    if (!chart) return;
    
    chart.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle' + (Math.random() > 0.5 ? ' red' : '');
        
        const height = 30 + Math.random() * 150;
        candle.style.height = height + 'px';
        candle.style.left = (i * 15) + 'px';
        candle.style.bottom = '50px';
        candle.style.width = '8px';
        candle.style.position = 'absolute';
        candle.style.background = Math.random() > 0.5 ? '#0ECB81' : '#F6465D';
        
        chart.appendChild(candle);
    }
}

function updateOrderBook() {
    const bidsContainer = document.getElementById('orderBookBids');
    const asksContainer = document.getElementById('orderBookAsks');
    
    if (bidsContainer) {
        bidsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const price = (18.61 - i * 0.01 - Math.random() * 0.02).toFixed(2);
            const volume = Math.floor(500 + Math.random() * 2000);
            const value = (price * volume / 1000).toFixed(0) + 'K';
            const row = document.createElement('div');
            row.className = 'order-book-row';
            row.innerHTML = `
                <span class="bid-price">${price}</span>
                <span>${volume}</span>
                <span>${value}</span>
            `;
            bidsContainer.appendChild(row);
        }
    }
    
    if (asksContainer) {
        asksContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const price = (18.61 + i * 0.01 + Math.random() * 0.02).toFixed(2);
            const volume = Math.floor(400 + Math.random() * 1500);
            const value = (price * volume / 1000).toFixed(0) + 'K';
            const row = document.createElement('div');
            row.className = 'order-book-row';
            row.innerHTML = `
                <span class="ask-price">${price}</span>
                <span>${volume}</span>
                <span>${value}</span>
            `;
            asksContainer.appendChild(row);
        }
    }
}

function updatePrice() {
    const priceEl = document.getElementById('currentPrice');
    if (!priceEl) return;
    
    const currentPrice = 112500 + Math.random() * 100;
    priceEl.textContent = currentPrice.toFixed(2);
    
    const changeEl = document.getElementById('priceChange');
    if (changeEl) {
        const change = (Math.random() * 2 - 1).toFixed(2);
        const changePercent = (Math.random() * 2).toFixed(2);
        changeEl.innerHTML = (change >= 0 ? '▲' : '▼') + ' ' + Math.abs(change) + ' (' + changePercent + '%)';
        changeEl.className = 'price-change ' + (change >= 0 ? 'positive' : 'negative');
    }
}

// Trading Functions
function openBuyOrder() {
    addConsoleMessage('TRADE', 'Buy order panel opened for MEBL');
    scrollToSection('orders');
}

function openSellOrder() {
    addConsoleMessage('TRADE', 'Sell order panel opened for MEBL');
    scrollToSection('orders');
}

function showJson(type) {
    if (jsonDefaults[type]) {
        addConsoleMessage('JSON', `Copied ${type} JSON to clipboard`);
        alert('JSON copied to clipboard!');
    }
}

function copyJson(type) {
    showJson(type);
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        
        // Update active nav
        document.querySelectorAll('.nav a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + id) {
                a.classList.add('active');
            }
        });
    }
}

// PIN Input Handling
document.addEventListener('DOMContentLoaded', function() {
    const pinInputs = document.querySelectorAll('.pin-digit');
    pinInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                if (index > 0) {
                    pinInputs[index - 1].focus();
                }
            }
        });
    });
    
    // Initialize
    connectWebSocket();
    generateChart();
    updateOrderBook();
    
    // Setup interval for latency
    setInterval(updateLatency, 1000);
});

// Export functions for HTML onclick
window.connectWebSocket = connectWebSocket;
window.disconnectWebSocket = disconnectWebSocket;
window.subscribeMarket = subscribeMarket;
window.subscribeOrders = subscribeOrders;
window.clearConsole = clearConsole;
window.openBuyOrder = openBuyOrder;
window.openSellOrder = openSellOrder;
window.showJson = showJson;
window.copyJson = copyJson;
window.scrollToSection = scrollToSection;