async function test() {
    console.log("Testing API...");
    try {
        const username = 'testuser_' + Date.now();
        const password = 'password123';

        let res = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email: username + '@test.com' })
        });
        console.log("Register:", res.status);

        res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        const token = data.token;

        const payload = { timeSlept: '08:00', date: '2026-02-22' };
        console.log("Sending payload:", payload);

        res = await fetch('http://localhost:8080/api/sleep', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });
        console.log("Save status:", res.status);

        res = await fetch('http://localhost:8080/api/sleep/history', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const history = await res.json();
        console.log("History from backend:", history);
    } catch (e) {
        console.error("Fetch failed", e);
    }
}
test();
