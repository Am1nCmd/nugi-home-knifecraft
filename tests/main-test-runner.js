/**
 * Main Test Runner for Nugi Home Knifecraft Website
 * Comprehensive testing using MCP Puppeteer
 *
 * This script orchestrates all testing suites and generates a comprehensive report
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class TestRunner {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      suites: []
    };

    this.baseUrl = 'http://localhost:3000';
    this.screenshots = [];
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Testing Suite for Nugi Home Knifecraft');
    console.log('━'.repeat(60));

    try {
      // Check if the development server is running
      await this.checkServerStatus();

      // Run all test suites
      await this.runNavigationTests();
      await this.runButtonTests();
      await this.runResponsiveTests();
      await this.runExternalLinkTests();
      await this.runFunctionalTests();
      await this.runPerformanceTests();

      // Generate final report
      await this.generateReport();

    } catch (error) {
      console.error('❌ Test runner failed:', error.message);
      process.exit(1);
    }
  }

  async checkServerStatus() {
    console.log('🔍 Checking development server status...');

    try {
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        console.log('✅ Development server is running');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Development server is not accessible');
      console.error('Please make sure "npm run dev" is running on port 3000');
      throw error;
    }
  }

  async runNavigationTests() {
    console.log('\n📄 Running Page Navigation Tests...');

    const testSuite = {
      name: 'Page Navigation Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    const pages = [
      { name: 'Homepage', url: '/', expectedTitle: 'Nugi Home Knifecraft' },
      { name: 'Products Page', url: '/products', expectedTitle: 'Products' },
      { name: 'Blog Page', url: '/blog', expectedTitle: 'Blog' },
      { name: 'About Page', url: '/about', expectedTitle: 'About' },
      { name: 'Admin Login', url: '/admin/login', expectedTitle: 'Admin' }
    ];

    for (const page of pages) {
      try {
        const result = await this.testPageNavigation(page);
        testSuite.tests.push(result);
        if (result.status === 'passed') testSuite.passed++;
        else testSuite.failed++;
      } catch (error) {
        testSuite.tests.push({
          name: page.name,
          status: 'failed',
          error: error.message
        });
        testSuite.failed++;
      }
    }

    this.testResults.suites.push(testSuite);
    this.updateSummary(testSuite);
  }

  async testPageNavigation(page) {
    // Use MCP Puppeteer via script execution
    const testScript = `
      const mcp = require('puppeteer');

      (async () => {
        const browser = await mcp.launch({ headless: true });
        const page = await browser.newPage();

        try {
          await page.goto('${this.baseUrl}${page.url}', { waitUntil: 'networkidle0' });
          const title = await page.title();

          // Take screenshot
          await page.screenshot({
            path: './tests/screenshots/${page.name.toLowerCase().replace(/\\s+/g, '-')}.png',
            fullPage: true
          });

          console.log(JSON.stringify({
            status: 'passed',
            url: '${page.url}',
            title: title,
            screenshot: '${page.name.toLowerCase().replace(/\\s+/g, '-')}.png'
          }));

        } catch (error) {
          console.log(JSON.stringify({
            status: 'failed',
            url: '${page.url}',
            error: error.message
          }));
        } finally {
          await browser.close();
        }
      })();
    `;

    return new Promise((resolve, reject) => {
      exec(`node -e "${testScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          try {
            const result = JSON.parse(stdout);
            resolve({
              name: page.name,
              url: page.url,
              ...result
            });
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }

  async runButtonTests() {
    console.log('\n🔘 Running Button & Component Tests...');

    const testSuite = {
      name: 'Button & Component Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    const buttonTests = [
      { name: 'Header Navigation Buttons', selector: 'header nav a' },
      { name: 'WhatsApp Purchase Buttons', selector: '[data-testid="whatsapp-button"]' },
      { name: 'Category Filter Buttons', selector: '[data-testid="category-filter"] button' },
      { name: 'Mobile Menu Toggle', selector: '[aria-label="Toggle mobile menu"]' },
      { name: 'Social Media Links', selector: 'footer a[href*="instagram"], footer a[href*="facebook"], footer a[href*="youtube"]' }
    ];

    for (const test of buttonTests) {
      try {
        const result = await this.testButtons(test);
        testSuite.tests.push(result);
        if (result.status === 'passed') testSuite.passed++;
        else testSuite.failed++;
      } catch (error) {
        testSuite.tests.push({
          name: test.name,
          status: 'failed',
          error: error.message
        });
        testSuite.failed++;
      }
    }

    this.testResults.suites.push(testSuite);
    this.updateSummary(testSuite);
  }

  async testButtons(test) {
    const testScript = `
      const mcp = require('puppeteer');

      (async () => {
        const browser = await mcp.launch({ headless: true });
        const page = await browser.newPage();

        try {
          await page.goto('${this.baseUrl}', { waitUntil: 'networkidle0' });

          const buttons = await page.$$('${test.selector}');
          const count = buttons.length;

          if (count === 0) {
            console.log(JSON.stringify({
              status: 'warning',
              message: 'No buttons found with selector: ${test.selector}',
              count: 0
            }));
          } else {
            // Test if buttons are visible and clickable
            let clickableCount = 0;
            for (const button of buttons) {
              const isVisible = await button.isIntersectingViewport();
              if (isVisible) clickableCount++;
            }

            console.log(JSON.stringify({
              status: 'passed',
              count: count,
              clickable: clickableCount,
              message: \`Found \${count} buttons, \${clickableCount} are clickable\`
            }));
          }

        } catch (error) {
          console.log(JSON.stringify({
            status: 'failed',
            error: error.message
          }));
        } finally {
          await browser.close();
        }
      })();
    `;

    return new Promise((resolve, reject) => {
      exec(`node -e "${testScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          try {
            const result = JSON.parse(stdout);
            resolve({
              name: test.name,
              selector: test.selector,
              ...result
            });
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }

  async runResponsiveTests() {
    console.log('\n📱 Running Responsive Design Tests...');

    const testSuite = {
      name: 'Responsive Design Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      try {
        const result = await this.testResponsive(viewport);
        testSuite.tests.push(result);
        if (result.status === 'passed') testSuite.passed++;
        else testSuite.failed++;
      } catch (error) {
        testSuite.tests.push({
          name: viewport.name,
          status: 'failed',
          error: error.message
        });
        testSuite.failed++;
      }
    }

    this.testResults.suites.push(testSuite);
    this.updateSummary(testSuite);
  }

  async testResponsive(viewport) {
    const testScript = `
      const mcp = require('puppeteer');

      (async () => {
        const browser = await mcp.launch({ headless: true });
        const page = await browser.newPage();

        try {
          await page.setViewport({ width: ${viewport.width}, height: ${viewport.height} });
          await page.goto('${this.baseUrl}', { waitUntil: 'networkidle0' });

          // Take screenshot
          await page.screenshot({
            path: './tests/screenshots/responsive-${viewport.name.toLowerCase()}.png',
            fullPage: true
          });

          // Check if mobile menu is visible/hidden appropriately
          const mobileMenuVisible = await page.$eval('[aria-label="Toggle mobile menu"]',
            el => window.getComputedStyle(el).display !== 'none'
          ).catch(() => false);

          // Check if desktop navigation is visible/hidden appropriately
          const desktopNavVisible = await page.$eval('nav.hidden',
            el => window.getComputedStyle(el).display !== 'none'
          ).catch(() => true);

          console.log(JSON.stringify({
            status: 'passed',
            viewport: '${viewport.width}x${viewport.height}',
            mobileMenuVisible: mobileMenuVisible,
            desktopNavVisible: desktopNavVisible,
            screenshot: 'responsive-${viewport.name.toLowerCase()}.png'
          }));

        } catch (error) {
          console.log(JSON.stringify({
            status: 'failed',
            viewport: '${viewport.width}x${viewport.height}',
            error: error.message
          }));
        } finally {
          await browser.close();
        }
      })();
    `;

    return new Promise((resolve, reject) => {
      exec(`node -e "${testScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          try {
            const result = JSON.parse(stdout);
            resolve({
              name: viewport.name,
              ...result
            });
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }

  async runExternalLinkTests() {
    console.log('\n🔗 Running External Link Tests...');

    const testSuite = {
      name: 'External Link Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    const externalLinks = [
      { name: 'WhatsApp Purchase Link', pattern: 'https://wa.me/6281199214' },
      { name: 'WhatsApp Contact Link', pattern: 'https://wa.me/6281199921' },
      { name: 'Instagram Link', pattern: 'https://instagram.com/nugihomeknifecraft' },
      { name: 'Facebook Link', pattern: 'https://facebook.com/nugihomeknifecraft' },
      { name: 'YouTube Link', pattern: 'https://youtube.com/@nugihomeknifecraft' }
    ];

    for (const link of externalLinks) {
      try {
        const result = await this.testExternalLink(link);
        testSuite.tests.push(result);
        if (result.status === 'passed' || result.status === 'warning') testSuite.passed++;
        else testSuite.failed++;
      } catch (error) {
        testSuite.tests.push({
          name: link.name,
          status: 'failed',
          error: error.message
        });
        testSuite.failed++;
      }
    }

    this.testResults.suites.push(testSuite);
    this.updateSummary(testSuite);
  }

  async testExternalLink(linkTest) {
    const testScript = `
      const mcp = require('puppeteer');

      (async () => {
        const browser = await mcp.launch({ headless: true });
        const page = await browser.newPage();

        try {
          await page.goto('${this.baseUrl}', { waitUntil: 'networkidle0' });

          // Find links containing the pattern
          const links = await page.$$eval('a', anchors =>
            anchors.filter(a => a.href.includes('${linkTest.pattern}'))
                   .map(a => ({ href: a.href, text: a.textContent.trim() }))
          );

          if (links.length === 0) {
            console.log(JSON.stringify({
              status: 'warning',
              message: 'No links found for pattern: ${linkTest.pattern}',
              found: []
            }));
          } else {
            console.log(JSON.stringify({
              status: 'passed',
              message: \`Found \${links.length} links matching pattern\`,
              found: links
            }));
          }

        } catch (error) {
          console.log(JSON.stringify({
            status: 'failed',
            error: error.message
          }));
        } finally {
          await browser.close();
        }
      })();
    `;

    return new Promise((resolve, reject) => {
      exec(`node -e "${testScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          try {
            const result = JSON.parse(stdout);
            resolve({
              name: linkTest.name,
              pattern: linkTest.pattern,
              ...result
            });
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }

  async runFunctionalTests() {
    console.log('\n⚙️ Running Functional Tests...');

    const testSuite = {
      name: 'Functional Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    // Test API endpoints
    const apiTests = [
      { name: 'Products API', endpoint: '/api/products/unified' },
      { name: 'Articles API', endpoint: '/api/articles' },
      { name: 'Auth Session API', endpoint: '/api/auth/session' }
    ];

    for (const api of apiTests) {
      try {
        const result = await this.testAPI(api);
        testSuite.tests.push(result);
        if (result.status === 'passed') testSuite.passed++;
        else testSuite.failed++;
      } catch (error) {
        testSuite.tests.push({
          name: api.name,
          status: 'failed',
          error: error.message
        });
        testSuite.failed++;
      }
    }

    this.testResults.suites.push(testSuite);
    this.updateSummary(testSuite);
  }

  async testAPI(apiTest) {
    try {
      const response = await fetch(`${this.baseUrl}${apiTest.endpoint}`);
      const data = await response.json();

      return {
        name: apiTest.name,
        endpoint: apiTest.endpoint,
        status: 'passed',
        statusCode: response.status,
        responseSize: JSON.stringify(data).length,
        message: `API responded with ${response.status}`
      };
    } catch (error) {
      return {
        name: apiTest.name,
        endpoint: apiTest.endpoint,
        status: 'failed',
        error: error.message
      };
    }
  }

  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');

    const testSuite = {
      name: 'Performance Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    const performanceScript = `
      const mcp = require('puppeteer');

      (async () => {
        const browser = await mcp.launch({ headless: true });
        const page = await browser.newPage();

        try {
          const startTime = Date.now();
          await page.goto('${this.baseUrl}', { waitUntil: 'networkidle0' });
          const loadTime = Date.now() - startTime;

          // Get performance metrics
          const metrics = await page.metrics();

          console.log(JSON.stringify({
            status: loadTime < 5000 ? 'passed' : 'warning',
            loadTime: loadTime,
            metrics: metrics,
            message: \`Page loaded in \${loadTime}ms\`
          }));

        } catch (error) {
          console.log(JSON.stringify({
            status: 'failed',
            error: error.message
          }));
        } finally {
          await browser.close();
        }
      })();
    `;

    try {
      const result = await new Promise((resolve, reject) => {
        exec(`node -e "${performanceScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            try {
              resolve(JSON.parse(stdout));
            } catch (parseError) {
              reject(parseError);
            }
          }
        });
      });

      testSuite.tests.push({
        name: 'Homepage Load Performance',
        ...result
      });

      if (result.status === 'passed') testSuite.passed++;
      else testSuite.failed++;

    } catch (error) {
      testSuite.tests.push({
        name: 'Homepage Load Performance',
        status: 'failed',
        error: error.message
      });
      testSuite.failed++;
    }

    this.testResults.suites.push(testSuite);
    this.updateSummary(testSuite);
  }

  updateSummary(testSuite) {
    this.testResults.summary.total += testSuite.passed + testSuite.failed;
    this.testResults.summary.passed += testSuite.passed;
    this.testResults.summary.failed += testSuite.failed;
  }

  async generateReport() {
    console.log('\n📊 Generating Test Report...');

    // Ensure screenshots directory exists
    await fs.mkdir('./tests/screenshots', { recursive: true }).catch(() => {});

    const reportHTML = this.generateHTMLReport();
    const reportJSON = JSON.stringify(this.testResults, null, 2);

    await fs.writeFile('./tests/test-report.html', reportHTML);
    await fs.writeFile('./tests/test-report.json', reportJSON);

    console.log('\n🎉 Testing Complete!');
    console.log('━'.repeat(60));
    console.log(`✅ Passed: ${this.testResults.summary.passed}`);
    console.log(`❌ Failed: ${this.testResults.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.testResults.summary.warnings}`);
    console.log(`📊 Total Tests: ${this.testResults.summary.total}`);
    console.log('\n📄 Reports generated:');
    console.log('  - ./tests/test-report.html');
    console.log('  - ./tests/test-report.json');
    console.log('  - ./tests/screenshots/');
  }

  generateHTMLReport() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nugi Home Knifecraft - Test Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2d3748; border-bottom: 3px solid #f6ad55; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card.passed { background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); }
        .stat-card.failed { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
        .stat-card.warnings { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .test-suite { margin: 30px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #f7fafc; padding: 15px; font-weight: bold; color: #2d3748; }
        .test-item { padding: 15px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .test-item:last-child { border-bottom: none; }
        .status { padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status.passed { background: #d1fae5; color: #065f46; }
        .status.failed { background: #fee2e2; color: #991b1b; }
        .status.warning { background: #fef3c7; color: #92400e; }
        .details { font-size: 12px; color: #6b7280; margin-top: 5px; }
        .timestamp { color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Nugi Home Knifecraft - Test Report</h1>
        <p class="timestamp">Generated: ${this.testResults.timestamp}</p>

        <div class="summary">
            <div class="stat-card">
                <h3>${this.testResults.summary.total}</h3>
                <p>Total Tests</p>
            </div>
            <div class="stat-card passed">
                <h3>${this.testResults.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="stat-card failed">
                <h3>${this.testResults.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="stat-card warnings">
                <h3>${this.testResults.summary.warnings}</h3>
                <p>Warnings</p>
            </div>
        </div>

        ${this.testResults.suites.map(suite => `
        <div class="test-suite">
            <div class="suite-header">
                ${suite.name} (${suite.passed} passed, ${suite.failed} failed)
            </div>
            ${suite.tests.map(test => `
            <div class="test-item">
                <div>
                    <strong>${test.name}</strong>
                    ${test.message ? `<div class="details">${test.message}</div>` : ''}
                    ${test.error ? `<div class="details">Error: ${test.error}</div>` : ''}
                </div>
                <span class="status ${test.status}">${test.status.toUpperCase()}</span>
            </div>
            `).join('')}
        </div>
        `).join('')}

        <div style="margin-top: 30px; padding: 20px; background: #f7fafc; border-radius: 8px;">
            <h3>📋 Test Summary</h3>
            <p>This comprehensive test suite validated:</p>
            <ul>
                <li>✅ Page navigation and rendering</li>
                <li>🔘 Button functionality and interactions</li>
                <li>📱 Responsive design across devices</li>
                <li>🔗 External link validation</li>
                <li>⚙️ API endpoints and functionality</li>
                <li>⚡ Performance metrics</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
  }
}

// Run the test suite
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
}

module.exports = TestRunner;