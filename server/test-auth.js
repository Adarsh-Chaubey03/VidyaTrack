// Test script for the new authentication system
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAuth() {
    console.log('🧪 Testing VidyaTrack Authentication System...\n');

    try {
        // Test 1: Register a new user
        console.log('1. Testing user registration...');
        const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'user'
            })
        });
        
        const registerData = await registerResponse.json();
        console.log('Register result:', registerData.success ? '✅ Success' : '❌ Failed');
        if (registerData.success) {
            console.log('User ID:', registerData.data._id);
            console.log('Token:', registerData.data.token.substring(0, 20) + '...');
        }

        // Test 2: Login with regular user
        console.log('\n2. Testing user login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('Login result:', loginData.success ? '✅ Success' : '❌ Failed');
        if (loginData.success) {
            console.log('User role:', loginData.data.role);
        }

        // Test 3: Educator login with specific credentials
        console.log('\n3. Testing educator login...');
        const educatorLoginResponse = await fetch(`${BASE_URL}/api/auth/educator-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'aditya@gmail.com',
                password: '12345678'
            })
        });
        
        const educatorData = await educatorLoginResponse.json();
        console.log('Educator login result:', educatorData.success ? '✅ Success' : '❌ Failed');
        if (educatorData.success) {
            console.log('Educator role:', educatorData.data.role);
            console.log('Educator token:', educatorData.data.token.substring(0, 20) + '...');
        }

        // Test 4: Test protected route with token
        if (educatorData.success) {
            console.log('\n4. Testing protected route with educator token...');
            const protectedResponse = await fetch(`${BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${educatorData.data.token}`
                }
            });
            
            const protectedData = await protectedResponse.json();
            console.log('Protected route result:', protectedData.success ? '✅ Success' : '❌ Failed');
            if (protectedData.success) {
                console.log('User data:', {
                    name: protectedData.data.name,
                    email: protectedData.data.email,
                    role: protectedData.data.role
                });
            }
        }

        // Test 5: Test educator dashboard
        if (educatorData.success) {
            console.log('\n5. Testing educator dashboard...');
            const dashboardResponse = await fetch(`${BASE_URL}/api/educator/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${educatorData.data.token}`
                }
            });
            
            const dashboardData = await dashboardResponse.json();
            console.log('Dashboard result:', dashboardData.success ? '✅ Success' : '❌ Failed');
            if (dashboardData.success) {
                console.log('Dashboard data:', dashboardData.dashboardData);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAuth();

