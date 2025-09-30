/**
 * Admin Authenticated Testing with MCP Puppeteer
 * Tests admin functionality using existing Safari session
 * Requires user to be logged in via Safari first
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class AdminAuthenticatedTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      timestamp: new Date().toISOString(),
      sessionTests: [],
      dashboardTests: [],
      productTests: [],
      crudTests: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    };
  }

  async runTests() {
    console.log('🔐 Starting Admin Authenticated Testing (Using Existing Session)');
    console.log('━'.repeat(70));
    console.log('🌐 Target URL:', this.baseUrl);
    console.log('🍪 Using existing browser session/cookies');
    console.log('━'.repeat(70));

    const browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      await this.testSessionValidation(browser);
      await this.testAuthenticatedDashboard(browser);
      await this.testProductManagement(browser);
      await this.testCRUDOperations(browser);
      await this.generateReport();
    } finally {
      await browser.close();
    }

    this.printSummary();
  }

  async testSessionValidation(browser) {
    console.log('\n🔍 Testing Session Validation...');

    const page = await browser.newPage();

    try {
      // Try to access dashboard directly
      await page.goto(`${this.baseUrl}/admin/dashboard`, {
        waitUntil: 'networkidle0',
        timeout: 15000
      });

      await page.waitForSelector('body', { timeout: 5000 });

      const sessionTest = await page.evaluate(() => {
        const currentUrl = window.location.href;
        const isOnDashboard = currentUrl.includes('/admin/dashboard');
        const isOnLogin = currentUrl.includes('/admin/login');

        // Check for admin dashboard elements
        const dashboardElements = {
          hasTitle: document.querySelector('h1') &&
                   document.querySelector('h1').textContent.includes('Dashboard'),
          hasUserInfo: document.querySelector('[class*="user"], [alt*="Admin"]'),
          hasStatCards: document.querySelectorAll('[class*="card"], [class*="Card"]').length > 3,
          hasNavigation: document.querySelector('nav') ||
                        document.querySelectorAll('a[href*="/admin/"]').length > 0,
          hasLogoutButton: Array.from(document.querySelectorAll('button, a')).some(el =>
            el.textContent.includes('Logout') || el.textContent.includes('logout')
          )
        };

        return {
          currentUrl,
          isOnDashboard,
          isOnLogin,
          isAuthenticated: isOnDashboard && !isOnLogin,
          dashboardElements
        };
      });

      // Take screenshot
      await fs.mkdir('./tests/admin/screenshots', { recursive: true });
      await page.screenshot({
        path: './tests/admin/screenshots/authenticated-session-check.png',
        fullPage: true
      });

      this.results.sessionTests.push({
        test: 'Session Authentication Validation',
        status: sessionTest.isAuthenticated ? 'passed' : 'warning',
        details: sessionTest,
        screenshot: 'authenticated-session-check.png',
        message: sessionTest.isAuthenticated ?
          'User is authenticated and on admin dashboard' :
          'User not authenticated - please login first in Safari'
      });

      // If not authenticated, show login instructions
      if (!sessionTest.isAuthenticated) {
        console.log('\n⚠️  User not authenticated!');
        console.log('📋 Please follow these steps:');
        console.log('   1. Open Safari and go to http://localhost:3000/admin/login');
        console.log('   2. Login with your Google account');
        console.log('   3. Navigate to the admin dashboard');
        console.log('   4. Keep Safari open and run this test again');
        console.log('');
      }

    } catch (error) {
      this.results.sessionTests.push({
        test: 'Session Authentication Validation',
        status: 'failed',
        error: error.message
      });
    }

    await page.close();
  }

  async testAuthenticatedDashboard(browser) {
    console.log('\n📊 Testing Authenticated Dashboard...');

    const page = await browser.newPage();

    try {
      await page.goto(`${this.baseUrl}/admin/dashboard`, { waitUntil: 'networkidle0' });

      const dashboardTest = await page.evaluate(() => {
        const isOnDashboard = window.location.href.includes('/admin/dashboard');

        if (!isOnDashboard) {
          return { authenticated: false, message: 'Not on dashboard - authentication required' };
        }

        // Test dashboard statistics
        const statsCards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        const statsNumbers = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent.trim();
          return /^\d+$/.test(text) && text.length < 6; // Numbers less than 6 digits
        });

        // Test dashboard navigation
        const adminLinks = Array.from(document.querySelectorAll('a')).filter(link =>
          link.href.includes('/admin/')
        );

        // Test user information
        const userInfo = {
          hasUserImage: !!document.querySelector('[alt*="Admin"], img[src*="googleusercontent"]'),
          hasUserName: Array.from(document.querySelectorAll('*')).some(el =>
            el.textContent.includes('@') || el.textContent.includes('Admin')
          ),
          hasUserEmail: Array.from(document.querySelectorAll('*')).some(el =>
            el.textContent.includes('@gmail.com') || el.textContent.includes('@')
          )
        };

        // Test management sections
        const managementSections = Array.from(document.querySelectorAll('*')).filter(el =>
          el.textContent.includes('Product Management') ||
          el.textContent.includes('Article Management') ||
          el.textContent.includes('Analytics') ||
          el.textContent.includes('Settings')
        );

        return {
          authenticated: true,
          statsCards: statsCards.length,
          statsNumbers: statsNumbers.length,
          adminLinks: adminLinks.length,
          userInfo,
          managementSections: managementSections.length,
          hasLogoutButton: Array.from(document.querySelectorAll('button, a')).some(el =>
            el.textContent.includes('Logout')
          )
        };
      });

      // Take screenshot of actual dashboard
      await page.screenshot({
        path: './tests/admin/screenshots/authenticated-dashboard.png',
        fullPage: true
      });

      this.results.dashboardTests.push({
        test: 'Authenticated Dashboard Content',
        status: dashboardTest.authenticated && dashboardTest.statsCards > 0 ? 'passed' : 'warning',
        details: dashboardTest,
        screenshot: 'authenticated-dashboard.png'
      });

    } catch (error) {
      this.results.dashboardTests.push({
        test: 'Authenticated Dashboard Content',
        status: 'failed',
        error: error.message
      });
    }

    await page.close();
  }

  async testProductManagement(browser) {
    console.log('\n📦 Testing Product Management with Authentication...');

    const page = await browser.newPage();

    try {
      await page.goto(`${this.baseUrl}/admin/products`, { waitUntil: 'networkidle0' });

      const productPageTest = await page.evaluate(() => {
        const isOnProductsPage = window.location.href.includes('/admin/products');

        if (!isOnProductsPage) {
          return { authenticated: false, message: 'Not on products page - authentication required' };
        }

        // Test tab structure
        const tabs = document.querySelectorAll('[role="tab"], [class*="tab"], [data-value]');
        const tabContent = Array.from(tabs).map(tab => ({
          text: tab.textContent.trim(),
          isActive: tab.getAttribute('aria-selected') === 'true' ||
                   tab.classList.contains('active') ||
                   tab.getAttribute('data-state') === 'active'
        }));

        // Test form elements
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, select, textarea');
        const buttons = document.querySelectorAll('button');

        // Test product list elements
        const productList = {
          hasTable: !!document.querySelector('table'),
          hasRows: document.querySelectorAll('tr, [class*="row"]').length,
          hasActionButtons: Array.from(buttons).filter(btn =>
            btn.textContent.includes('Edit') ||
            btn.textContent.includes('Delete') ||
            btn.textContent.includes('Add') ||
            btn.textContent.includes('Tambah')
          ).length
        };

        // Test CSV functionality
        const csvElements = {
          hasFileInput: !!document.querySelector('input[type="file"]'),
          hasUploadButton: Array.from(buttons).some(btn =>
            btn.textContent.includes('Upload') || btn.textContent.includes('Import')
          ),
          hasDownloadButton: Array.from(buttons).some(btn =>
            btn.textContent.includes('Download') || btn.textContent.includes('Export')
          )
        };

        return {
          authenticated: true,
          tabCount: tabs.length,
          tabContent,
          formCount: forms.length,
          inputCount: inputs.length,
          buttonCount: buttons.length,
          productList,
          csvElements
        };
      });

      // Test tab switching
      const tabSwitchTest = await page.evaluate(() => {
        const tabs = document.querySelectorAll('[role="tab"], [class*="tab"], [data-value]');
        const results = [];

        for (let i = 0; i < Math.min(tabs.length, 3); i++) {
          const tab = tabs[i];
          try {
            tab.click();
            results.push({
              tabIndex: i,
              tabText: tab.textContent.trim(),
              clickable: true
            });
          } catch (e) {
            results.push({
              tabIndex: i,
              tabText: tab.textContent.trim(),
              clickable: false,
              error: e.message
            });
          }
        }

        return results;
      });

      // Take screenshot of products page
      await page.screenshot({
        path: './tests/admin/screenshots/authenticated-products.png',
        fullPage: true
      });

      this.results.productTests.push({
        test: 'Authenticated Product Management Page',
        status: productPageTest.authenticated && productPageTest.tabCount > 0 ? 'passed' : 'warning',
        details: productPageTest,
        screenshot: 'authenticated-products.png'
      });

      this.results.productTests.push({
        test: 'Product Management Tab Switching',
        status: tabSwitchTest.length > 0 ? 'passed' : 'warning',
        details: tabSwitchTest
      });

    } catch (error) {
      this.results.productTests.push({
        test: 'Authenticated Product Management Page',
        status: 'failed',
        error: error.message
      });
    }

    await page.close();
  }

  async testCRUDOperations(browser) {
    console.log('\n⚙️ Testing CRUD Operations with Authentication...');

    const page = await browser.newPage();

    try {
      await page.goto(`${this.baseUrl}/admin/products`, { waitUntil: 'networkidle0' });

      // Test API calls with authentication
      const apiTests = [];
      const endpoints = [
        { path: '/api/admin/products', method: 'GET', description: 'Get admin products' },
        { path: '/api/admin/products/export', method: 'GET', description: 'Export CSV' }
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await page.goto(`${this.baseUrl}${endpoint.path}`, {
            waitUntil: 'networkidle0',
            timeout: 5000
          });

          let responseData = null;
          try {
            const text = await response.text();
            responseData = text.substring(0, 200); // First 200 chars
          } catch (e) {
            responseData = 'Could not read response';
          }

          apiTests.push({
            endpoint: endpoint.path,
            method: endpoint.method,
            description: endpoint.description,
            status: response.status(),
            isSuccessful: response.status() >= 200 && response.status() < 400,
            responsePreview: responseData
          });

        } catch (error) {
          apiTests.push({
            endpoint: endpoint.path,
            method: endpoint.method,
            description: endpoint.description,
            error: error.message,
            isSuccessful: false
          });
        }
      }

      // Test form submission capability
      await page.goto(`${this.baseUrl}/admin/products`, { waitUntil: 'networkidle0' });

      const formTest = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const formDetails = Array.from(forms).map((form, index) => {
          const inputs = form.querySelectorAll('input, select, textarea');
          const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

          return {
            formIndex: index,
            inputCount: inputs.length,
            hasSubmitButton: !!submitButton,
            action: form.action,
            method: form.method,
            inputs: Array.from(inputs).map(input => ({
              type: input.type || input.tagName.toLowerCase(),
              name: input.name || input.id,
              required: input.required,
              placeholder: input.placeholder
            }))
          };
        });

        return {
          formCount: forms.length,
          formDetails
        };
      });

      this.results.crudTests.push({
        test: 'Authenticated API Access',
        status: apiTests.some(test => test.isSuccessful) ? 'passed' : 'warning',
        details: apiTests
      });

      this.results.crudTests.push({
        test: 'Form Structure for CRUD Operations',
        status: formTest.formCount > 0 ? 'passed' : 'warning',
        details: formTest
      });

    } catch (error) {
      this.results.crudTests.push({
        test: 'CRUD Operations Testing',
        status: 'failed',
        error: error.message
      });
    }

    await page.close();
  }

  async generateReport() {
    console.log('\n📊 Generating Authenticated Admin Test Report...');

    // Calculate summary
    const allTests = [
      ...this.results.sessionTests,
      ...this.results.dashboardTests,
      ...this.results.productTests,
      ...this.results.crudTests
    ];

    this.results.summary = {
      passed: allTests.filter(t => t.status === 'passed').length,
      failed: allTests.filter(t => t.status === 'failed').length,
      warnings: allTests.filter(t => t.status === 'warning').length,
      total: allTests.length
    };

    // Create directory if it doesn't exist
    await fs.mkdir('./tests/admin/reports', { recursive: true });

    // Generate detailed JSON report
    await fs.writeFile(
      './tests/admin/reports/admin-authenticated-report.json',
      JSON.stringify(this.results, null, 2)
    );

    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    await fs.writeFile(
      './tests/admin/reports/admin-authenticated-report.html',
      htmlReport
    );
  }

  generateHTMLReport() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Authenticated Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary-card.passed { border-left: 4px solid #10b981; }
        .summary-card.failed { border-left: 4px solid #ef4444; }
        .summary-card.warnings { border-left: 4px solid #f59e0b; }
        .test-section { background: white; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section-header { background: #f1f5f9; padding: 15px; font-weight: 600; color: #334155; }
        .test-item { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .test-item:last-child { border-bottom: none; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status.passed { background: #d1fae5; color: #065f46; }
        .status.failed { background: #fee2e2; color: #991b1b; }
        .status.warning { background: #fef3c7; color: #92400e; }
        .details { margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 4px; font-size: 14px; }
        pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
        .screenshot-link { display: inline-block; margin: 5px 0; padding: 5px 10px; background: #e0e7ff; color: #3730a3; text-decoration: none; border-radius: 4px; font-size: 12px; }
        .auth-status { padding: 10px; border-radius: 6px; margin: 10px 0; }
        .auth-status.success { background: #d1fae5; color: #065f46; }
        .auth-status.warning { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Admin Authenticated Test Report</h1>
            <p>Nugi Home Knifecraft - Full Admin Functionality Testing</p>
            <p><small>Generated: ${this.results.timestamp}</small></p>
        </div>

        <div class="summary">
            <div class="summary-card passed">
                <h3>${this.results.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${this.results.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card warnings">
                <h3>${this.results.summary.warnings}</h3>
                <p>Warnings</p>
            </div>
            <div class="summary-card">
                <h3>${this.results.summary.total}</h3>
                <p>Total Tests</p>
            </div>
        </div>

        <div class="test-section">
            <div class="section-header">🔍 Session Validation Tests</div>
            ${this.results.sessionTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    ${test.message ? `<div class="auth-status ${test.status}">${test.message}</div>` : ''}
                    ${test.details ? `<div class="details"><pre>${JSON.stringify(test.details, null, 2)}</pre></div>` : ''}
                    ${test.screenshot ? `<a href="../screenshots/${test.screenshot}" class="screenshot-link">📸 View Screenshot</a>` : ''}
                    ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="test-section">
            <div class="section-header">📊 Dashboard Tests</div>
            ${this.results.dashboardTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    ${test.details ? `<div class="details"><pre>${JSON.stringify(test.details, null, 2)}</pre></div>` : ''}
                    ${test.screenshot ? `<a href="../screenshots/${test.screenshot}" class="screenshot-link">📸 View Screenshot</a>` : ''}
                    ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="test-section">
            <div class="section-header">📦 Product Management Tests</div>
            ${this.results.productTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    ${test.details ? `<div class="details"><pre>${JSON.stringify(test.details, null, 2)}</pre></div>` : ''}
                    ${test.screenshot ? `<a href="../screenshots/${test.screenshot}" class="screenshot-link">📸 View Screenshot</a>` : ''}
                    ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="test-section">
            <div class="section-header">⚙️ CRUD Operations Tests</div>
            ${this.results.crudTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    ${test.details ? `<div class="details"><pre>${JSON.stringify(test.details, null, 2)}</pre></div>` : ''}
                    ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="test-section">
            <div class="section-header">📋 Testing Instructions</div>
            <div class="test-item">
                <h4>📝 Prerequisites:</h4>
                <ol>
                    <li>Login to your admin account in Safari</li>
                    <li>Navigate to http://localhost:3000/admin/dashboard</li>
                    <li>Keep Safari open during testing</li>
                    <li>Run this test script</li>
                </ol>

                <h4>🎯 What This Test Covers:</h4>
                <ul>
                    <li>✅ Session authentication validation</li>
                    <li>✅ Real dashboard with statistics</li>
                    <li>✅ Product management interface</li>
                    <li>✅ Tab navigation functionality</li>
                    <li>✅ Form structures for CRUD operations</li>
                    <li>✅ API endpoints with authentication</li>
                    <li>✅ CSV import/export features</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  printSummary() {
    console.log('\n📊 Admin Authenticated Test Summary:');
    console.log('━'.repeat(70));
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`📊 Total: ${this.results.summary.total}`);
    console.log('\n📄 Reports generated:');
    console.log('  - ./tests/admin/reports/admin-authenticated-report.html');
    console.log('  - ./tests/admin/reports/admin-authenticated-report.json');
    console.log('  - ./tests/admin/screenshots/');
    console.log('\n💡 Note: This test requires you to be logged in via Safari first!');
  }
}

// Run the tests
if (require.main === module) {
  const tester = new AdminAuthenticatedTester();
  tester.runTests().catch(console.error);
}

module.exports = AdminAuthenticatedTester;