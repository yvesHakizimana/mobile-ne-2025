// Simple script to test MockAPI endpoints

// Base URL for the API
const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

// Helper function to make API requests
async function makeRequest(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`${method} request to ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Request failed:', error.message);
    return null;
  }
}

// Test functions for different API endpoints
async function testUsersAPI() {
  console.log('\n===== TESTING USERS API =====');
  
  // Get all users
  console.log('\n1. Testing GET all users:');
  const users = await makeRequest(`${BASE_URL}/users`);
  
  if (users && users.length > 0) {
    // Get user by username
    const username = users[0].username;
    console.log(`\n2. Testing GET user by username (${username}):`);
    await makeRequest(`${BASE_URL}/users?username=${username}`);
  }
}

async function testExpensesAPI() {
  console.log('\n===== TESTING EXPENSES API =====');
  
  // Get all expenses
  console.log('\n1. Testing GET all expenses:');
  const expenses = await makeRequest(`${BASE_URL}/expenses`);
  
  // Create a new expense
  console.log('\n2. Testing POST new expense:');
  const newExpense = {
    userId: '1',
    amount: 25.99,
    category: 'Food',
    description: 'Lunch at cafe',
    date: new Date().toISOString()
  };
  const createdExpense = await makeRequest(`${BASE_URL}/expenses`, 'POST', newExpense);
  
  if (createdExpense && createdExpense.id) {
    // Get specific expense by ID
    console.log(`\n3. Testing GET expense by ID (${createdExpense.id}):`);
    await makeRequest(`${BASE_URL}/expenses/${createdExpense.id}`);
    
    // Delete the expense
    console.log(`\n4. Testing DELETE expense by ID (${createdExpense.id}):`);
    await makeRequest(`${BASE_URL}/expenses/${createdExpense.id}`, 'DELETE');
  }
  
  // Verify expense was deleted (should not be found)
  if (createdExpense && createdExpense.id) {
    console.log(`\n5. Verifying expense was deleted (${createdExpense.id}):`);
    await makeRequest(`${BASE_URL}/expenses/${createdExpense.id}`);
  }
}

// Run tests
async function runTests() {
  console.log('Starting API tests...');
  await testUsersAPI();
  await testExpensesAPI();
  console.log('\nAPI testing complete!');
}

// Execute tests
runTests();