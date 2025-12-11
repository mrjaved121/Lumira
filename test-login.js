/**
 * Simple Node.js script to test Login API
 * Run: node test-login.js
 */

const baseUrl = 'http://localhost:3000/api';

async function testAPI() {
  console.log('\n=== Testing Lumira Authentication APIs ===\n');

  // Step 1: Register a test user
  console.log('Step 1: Registering a test user...');
  try {
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
      }),
    });

    const registerData = await registerResponse.json();
    
    if (registerData.success) {
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${registerData.data.user._id}`);
      console.log(`   Email: ${registerData.data.user.email}\n`);
    } else {
      if (registerData.error?.includes('already exists')) {
        console.log('ℹ️  User already exists, continuing with login test...\n');
      } else {
        console.log(`❌ Registration failed: ${registerData.error}\n`);
      }
    }
  } catch (error) {
    console.log(`❌ Registration error: ${error.message}\n`);
  }

  // Step 2: Test Login with Valid Credentials
  console.log('Step 2: Testing login with valid credentials...');
  try {
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const loginData = await loginResponse.json();

    if (loginData.success) {
      console.log('✅ Login successful!');
      console.log(`   User: ${loginData.data.user.name}`);
      console.log(`   Email: ${loginData.data.user.email}`);
      console.log(`   Role: ${loginData.data.user.role}`);
      console.log(`   Token: ${loginData.data.token.substring(0, 30)}...\n`);

      // Step 3: Test /me endpoint
      console.log('Step 3: Testing GET /api/auth/me with token...');
      try {
        const meResponse = await fetch(`${baseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${loginData.data.token}`,
          },
        });

        const meData = await meResponse.json();

        if (meData.success) {
          console.log('✅ /me endpoint works!');
          console.log(`   Retrieved user: ${meData.data.user.name}\n`);
        } else {
          console.log(`❌ /me endpoint failed: ${meData.error}\n`);
        }
      } catch (error) {
        console.log(`❌ /me endpoint error: ${error.message}\n`);
      }
    } else {
      console.log(`❌ Login failed: ${loginData.error}\n`);
    }
  } catch (error) {
    console.log(`❌ Login error: ${error.message}\n`);
  }

  // Step 4: Test Login with Invalid Password
  console.log('Step 4: Testing login with invalid password...');
  try {
    const invalidResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    const invalidData = await invalidResponse.json();

    if (invalidResponse.status === 401) {
      console.log('✅ Correctly rejected invalid password!');
      console.log(`   Error: ${invalidData.error}\n`);
    } else {
      console.log(`❌ Unexpected response: ${invalidData.error}\n`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Step 5: Test Login with Invalid Email
  console.log('Step 5: Testing login with invalid email...');
  try {
    const invalidEmailResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    });

    const invalidEmailData = await invalidEmailResponse.json();

    if (invalidEmailResponse.status === 401) {
      console.log('✅ Correctly rejected invalid email!');
      console.log(`   Error: ${invalidEmailData.error}\n`);
    } else {
      console.log(`❌ Unexpected response: ${invalidEmailData.error}\n`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Step 6: Test Login with Invalid Data Format
  console.log('Step 6: Testing login with invalid data format...');
  try {
    const invalidFormatResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'not-an-email',
        password: '123',
      }),
    });

    const invalidFormatData = await invalidFormatResponse.json();

    if (invalidFormatResponse.status === 400) {
      console.log('✅ Correctly rejected invalid format!');
      console.log('   Validation errors:');
      invalidFormatData.details?.forEach((err) => {
        console.log(`     - ${err.field}: ${err.message}`);
      });
      console.log('');
    } else {
      console.log(`❌ Unexpected response: ${invalidFormatData.error}\n`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  console.log('=== Testing Complete ===\n');
}

// Run the tests
testAPI().catch(console.error);



