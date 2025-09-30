#!/usr/bin/env node

/**
 * Comprehensive Test Script for Admin Article Form
 * Tests various scenarios for article submission
 */

const API_URL = 'http://localhost:3000/api/articles';

// Test data sets
const testCases = [
  {
    name: "✅ Valid News Article (Complete Data)",
    data: {
      type: "news",
      title: "Tren Pisau Modern 2025",
      excerpt: "Eksplorasi desain pisau modern yang menggabungkan teknologi dan tradisi",
      image: "/test-news-image.jpg"
    },
    expectedStatus: 401, // Should fail due to no auth
    expectedResult: "success"
  },

  {
    name: "✅ Valid Knowledge Article (Complete Data)",
    data: {
      type: "knowledge",
      title: "Teknik Heat Treatment Pisau",
      excerpt: "Panduan lengkap proses hardening dan tempering untuk kualitas bilah optimal",
      icon: "square"
    },
    expectedStatus: 401, // Should fail due to no auth
    expectedResult: "success"
  },

  {
    name: "✅ Valid Blog Article (Complete Data)",
    data: {
      type: "blog",
      title: "Perjalanan Membuat Pisau Pertama",
      excerpt: "Cerita personal tentang proses belajar knife making dari nol",
      content: "Ini adalah konten lengkap artikel blog yang berisi pengalaman mendalam dalam dunia knife making. Dimulai dari pemilihan baja, desain bilah, proses forging, heat treatment, hingga finishing akhir.",
      image: "/test-blog-image.jpg",
      publishDate: "15 Januari 2025",
      readTime: "8 menit"
    },
    expectedStatus: 401, // Should fail due to no auth
    expectedResult: "success"
  },

  {
    name: "❌ Missing Title",
    data: {
      type: "news",
      excerpt: "Artikel tanpa judul untuk testing validasi",
      image: "/test-image.jpg"
    },
    expectedStatus: 401, // Should fail due to no auth, but would fail validation too
    expectedResult: "error"
  },

  {
    name: "❌ Missing Excerpt",
    data: {
      type: "news",
      title: "Artikel Tanpa Ringkasan",
      image: "/test-image.jpg"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Invalid Article Type",
    data: {
      type: "invalid_type",
      title: "Test Article",
      excerpt: "Testing invalid article type",
      image: "/test-image.jpg"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Missing Article Type",
    data: {
      title: "Test Article",
      excerpt: "Testing missing article type",
      image: "/test-image.jpg"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ News Article Missing Image",
    data: {
      type: "news",
      title: "Artikel Berita Tanpa Gambar",
      excerpt: "Testing news article without required image"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Knowledge Article Missing Icon",
    data: {
      type: "knowledge",
      title: "Artikel Pengetahuan Tanpa Ikon",
      excerpt: "Testing knowledge article without required icon"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Blog Article Missing Content",
    data: {
      type: "blog",
      title: "Blog Tanpa Konten",
      excerpt: "Testing blog article without required content",
      image: "/test-blog.jpg",
      publishDate: "15 Januari 2025",
      readTime: "5 menit"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Blog Article Missing Publish Date",
    data: {
      type: "blog",
      title: "Blog Tanpa Tanggal",
      excerpt: "Testing blog article without publish date",
      content: "Konten lengkap blog untuk testing",
      image: "/test-blog.jpg",
      readTime: "5 menit"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Blog Article Missing Read Time",
    data: {
      type: "blog",
      title: "Blog Tanpa Waktu Baca",
      excerpt: "Testing blog article without read time",
      content: "Konten lengkap blog untuk testing",
      image: "/test-blog.jpg",
      publishDate: "15 Januari 2025"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Multiple Missing Fields",
    data: {
      type: "blog",
      title: "Blog Tidak Lengkap"
      // Missing: excerpt, content, image, publishDate, readTime
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Empty Title",
    data: {
      type: "news",
      title: "   ",
      excerpt: "Testing empty title after trim",
      image: "/test-image.jpg"
    },
    expectedStatus: 401,
    expectedResult: "error"
  },

  {
    name: "❌ Empty Excerpt",
    data: {
      type: "news",
      title: "Test Article",
      excerpt: "   ",
      image: "/test-image.jpg"
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
  console.log(`🧪 Testing Admin Article Form API`);
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
  console.log(`   2. Test through the web interface at /admin/articles`);
  console.log(`   3. Verify data persistence and maker attribution`);
  console.log(`   4. Test all article types (news, knowledge, blog)`);
}

// Run the tests
runAllTests().catch(console.error);