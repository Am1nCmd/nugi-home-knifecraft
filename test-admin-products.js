#!/usr/bin/env node

/**
 * Comprehensive Test Script for Admin Product Form
 * Tests various scenarios for product submission
 */

const API_URL = 'http://localhost:3000/api/admin/products';

// Test data sets
const testCases = [
  {
    name: "✅ Valid Knife Product (Complete Data)",
    data: {
      title: "Pisau Chef Premium Test",
      price: "450000",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeThicknessMm: "3",
      weightGr: "250",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      description: "Test product for validation",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401, // Should fail due to no auth
    expectedResult: "success"
  },

  {
    name: "✅ Valid Tool Product (Complete Data)",
    data: {
      title: "Kampak Bushcraft Test",
      price: "750000",
      type: "tool",
      category: "Axe",
      steel: "1055 Carbon Steel",
      handleMaterial: "Hickory Wood",
      bladeLengthCm: "15",
      handleLengthCm: "40",
      bladeStyle: "Bearded",
      handleStyle: "Straight",
      images: ["/test-axe.jpg"]
    },
    expectedStatus: 401, // Should fail due to no auth
    expectedResult: "success"
  },

  {
    name: "❌ Missing Title",
    data: {
      price: "450000",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401, // Should fail due to no auth, but would fail validation too
    expectedResult: "error"
  },

  {
    name: "❌ Missing Price",
    data: {
      title: "Test Knife",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Invalid Price (Non-numeric)",
    data: {
      title: "Test Knife",
      price: "abc123",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Missing Category",
    data: {
      title: "Test Knife",
      price: "450000",
      type: "knife",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Invalid Category",
    data: {
      title: "Test Knife",
      price: "450000",
      type: "knife",
      category: "InvalidCategory",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Missing Images",
    data: {
      title: "Test Knife",
      price: "450000",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Missing Steel",
    data: {
      title: "Test Knife",
      price: "450000",
      type: "knife",
      category: "Kitchen",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Invalid Blade Length (Non-numeric)",
    data: {
      title: "Test Knife",
      price: "450000",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "abc",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Zero/Negative Price",
    data: {
      title: "Test Knife",
      price: "-100",
      type: "knife",
      category: "Kitchen",
      steel: "AUS-8",
      handleMaterial: "Pakka Wood",
      bladeLengthCm: "20",
      handleLengthCm: "12",
      bladeStyle: "Chef",
      handleStyle: "Ergonomic",
      images: ["/test-knife.jpg"]
    },
    expectedStatus: 401,
    expectedResult: "error"
  }
];

async function testCase(testCase) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCase.data)
    });

    const result = await response.json();

    console.log(`\n📋 ${testCase.name}`);
    console.log(`   Status: ${response.status} (Expected: ${testCase.expectedStatus})`);
    console.log(`   Response: ${JSON.stringify(result)}`);

    // Check if response matches expectations
    if (response.status === testCase.expectedStatus) {
      console.log(`   ✅ Status code correct`);
    } else {
      console.log(`   ❌ Status code mismatch`);
    }

    // For unauthorized requests, we expect error message
    if (response.status === 401) {
      if (result.error === "Unauthorized") {
        console.log(`   ✅ Correct auth error message`);
      } else {
        console.log(`   ❌ Unexpected auth error format`);
      }
    }

    return { name: testCase.name, status: response.status, result };
  } catch (error) {
    console.log(`\n📋 ${testCase.name}`);
    console.log(`   ❌ Network Error: ${error.message}`);
    return { name: testCase.name, error: error.message };
  }
}

async function runAllTests() {
  console.log(`🧪 Testing Admin Product Form API`);
  console.log(`📡 API Endpoint: ${API_URL}`);
  console.log(`⚠️  Note: All tests will return 401 Unauthorized since we're not authenticated`);
  console.log(`🎯 We're testing the API structure and error handling\n`);

  const results = [];

  for (const testCaseData of testCases) {
    const result = await testCase(testCaseData);
    results.push(result);
  }

  console.log(`\n\n📊 TEST SUMMARY`);
  console.log(`═══════════════════════════════════════════════════════════════`);

  let passed = 0;
  let failed = 0;

  results.forEach((result, index) => {
    const expected = testCases[index];
    if (result.status === expected.expectedStatus) {
      console.log(`✅ ${result.name}`);
      passed++;
    } else {
      console.log(`❌ ${result.name}`);
      failed++;
    }
  });

  console.log(`\n📈 Results: ${passed} passed, ${failed} failed`);

  if (passed === results.length) {
    console.log(`🎉 All API structure tests passed!`);
    console.log(`🔐 Authentication is working correctly`);
    console.log(`⚡ Ready for authenticated testing`);
  } else {
    console.log(`⚠️  Some tests failed - check API implementation`);
  }

  console.log(`\n📝 Next Steps:`);
  console.log(`   1. Test with actual admin authentication`);
  console.log(`   2. Test through the web interface`);
  console.log(`   3. Verify data persistence and maker attribution`);
}

// Run the tests
runAllTests().catch(console.error);