/**
 * Master Test Orchestrator for Nugi Home Knifecraft
 * Runs all test suites and generates comprehensive reports
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class MasterTestRunner {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      timestamp: new Date().toISOString(),
      testSuites: [],
      overallSummary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        duration: 0
      }
    };
    this.startTime = Date.now();
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Test Suite for Nugi Home Knifecraft');
    console.log('━'.repeat(80));
    console.log('📅 Test Session:', new Date().toLocaleString());
    console.log('🌐 Target URL:', this.baseUrl);
    console.log('━'.repeat(80));

    try {
      // Check if server is running
      await this.checkServerStatus();

      // Install puppeteer if not installed
      await this.ensurePuppeteerInstalled();

      // Create test directories
      await this.setupTestDirectories();

      // Run all test suites
      await this.runPageNavigationTests();
      await this.runWhatsAppSocialTests();
      await this.runFunctionalTests();
      await this.runAccessibilityTests();

      // Generate master report
      await this.generateMasterReport();

      console.log('\n🎉 All tests completed successfully!');
      this.printFinalSummary();

    } catch (error) {
      console.error('\n❌ Test execution failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }

  async checkServerStatus() {
    console.log('🔍 Checking development server status...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.baseUrl, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ Development server is running and accessible');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Server connection timeout - make sure the server is running');
      }
      throw new Error(`Cannot connect to development server: ${error.message}`);
    }
  }

  async ensurePuppeteerInstalled() {
    console.log('📦 Checking Puppeteer installation...');

    try {
      require.resolve('puppeteer');
      console.log('✅ Puppeteer is installed');
    } catch (error) {
      console.log('📥 Installing Puppeteer...');
      await this.runCommand('npm', ['install', 'puppeteer', '--save-dev']);
      console.log('✅ Puppeteer installed successfully');
    }
  }

  async setupTestDirectories() {
    console.log('📁 Setting up test directories...');

    const directories = [
      './tests/reports',
      './tests/screenshots',
      './tests/logs'
    ];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }

    console.log('✅ Test directories created');
  }

  async runPageNavigationTests() {
    console.log('\n🧭 Running Page Navigation & UI Tests...');

    try {
      const result = await this.runTestScript('./tests/page-navigation-test.js');
      const reportPath = './tests/reports/page-navigation-report.json';

      if (await this.fileExists(reportPath)) {
        const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
        this.results.testSuites.push({
          name: 'Page Navigation & UI Tests',
          status: 'completed',
          summary: report.summary,
          reportPath: reportPath,
          duration: result.duration
        });
      }

      console.log('✅ Page Navigation tests completed');
    } catch (error) {
      console.error('❌ Page Navigation tests failed:', error.message);
      this.results.testSuites.push({
        name: 'Page Navigation & UI Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runWhatsAppSocialTests() {
    console.log('\n📱 Running WhatsApp & Social Media Tests...');

    try {
      const result = await this.runTestScript('./tests/whatsapp-social-test.js');
      const reportPath = './tests/reports/whatsapp-social-report.json';

      if (await this.fileExists(reportPath)) {
        const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
        this.results.testSuites.push({
          name: 'WhatsApp & Social Media Tests',
          status: 'completed',
          summary: report.summary,
          reportPath: reportPath,
          duration: result.duration
        });
      }

      console.log('✅ WhatsApp & Social Media tests completed');
    } catch (error) {
      console.error('❌ WhatsApp & Social Media tests failed:', error.message);
      this.results.testSuites.push({
        name: 'WhatsApp & Social Media Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runFunctionalTests() {
    console.log('\n⚙️ Running Functional API Tests...');

    try {
      const apiTests = [
        { name: 'Products API', endpoint: '/api/products/unified' },
        { name: 'Articles API', endpoint: '/api/articles' },
        { name: 'Auth Session API', endpoint: '/api/auth/session' },
        { name: 'Knives API', endpoint: '/api/knives' },
        { name: 'Tools API', endpoint: '/api/tools' }
      ];

      const results = [];

      for (const api of apiTests) {
        try {
          console.log(`  Testing: ${api.name}`);
          const startTime = Date.now();
          const response = await fetch(`${this.baseUrl}${api.endpoint}`);
          const duration = Date.now() - startTime;

          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            data = 'Non-JSON response';
          }

          results.push({
            name: api.name,
            endpoint: api.endpoint,
            status: response.ok ? 'passed' : 'failed',
            statusCode: response.status,
            duration: duration,
            responseSize: typeof data === 'object' ? JSON.stringify(data).length : 0,
            hasData: Array.isArray(data) ? data.length > 0 : !!data
          });

        } catch (error) {
          results.push({
            name: api.name,
            endpoint: api.endpoint,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Save API test results
      await fs.writeFile(
        './tests/reports/api-tests-report.json',
        JSON.stringify({ timestamp: new Date().toISOString(), tests: results }, null, 2)
      );

      const passed = results.filter(r => r.status === 'passed').length;
      const failed = results.filter(r => r.status === 'failed').length;

      this.results.testSuites.push({
        name: 'Functional API Tests',
        status: 'completed',
        summary: { passed, failed, warnings: 0, total: results.length },
        reportPath: './tests/reports/api-tests-report.json'
      });

      console.log('✅ Functional API tests completed');
    } catch (error) {
      console.error('❌ Functional API tests failed:', error.message);
      this.results.testSuites.push({
        name: 'Functional API Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runAccessibilityTests() {
    console.log('\n♿ Running Basic Accessibility Tests...');

    try {
      const accessibilityScript = `
        const puppeteer = require('puppeteer');
        const fs = require('fs').promises;

        (async () => {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();

          try {
            await page.goto('${this.baseUrl}', { waitUntil: 'networkidle0' });

            const accessibilityChecks = await page.evaluate(() => {
              const results = [];

              // Check for alt attributes on images
              const images = document.querySelectorAll('img');
              const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
              results.push({
                test: 'Images with Alt Text',
                status: imagesWithoutAlt.length === 0 ? 'passed' : 'warning',
                total: images.length,
                missing: imagesWithoutAlt.length
              });

              // Check for heading hierarchy
              const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
              const hasH1 = document.querySelector('h1') !== null;
              results.push({
                test: 'Heading Structure',
                status: hasH1 ? 'passed' : 'warning',
                totalHeadings: headings.length,
                hasH1: hasH1
              });

              // Check for form labels
              const inputs = document.querySelectorAll('input, select, textarea');
              const inputsWithoutLabels = Array.from(inputs).filter(input => {
                const label = document.querySelector(\`label[for="\${input.id}"]\`) ||
                            input.closest('label') ||
                            input.getAttribute('aria-label') ||
                            input.getAttribute('aria-labelledby');
                return !label;
              });
              results.push({
                test: 'Form Labels',
                status: inputsWithoutLabels.length === 0 ? 'passed' : 'warning',
                total: inputs.length,
                missing: inputsWithoutLabels.length
              });

              // Check for focus indicators
              const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
              results.push({
                test: 'Focusable Elements',
                status: focusableElements.length > 0 ? 'passed' : 'warning',
                total: focusableElements.length
              });

              return results;
            });

            const report = {
              timestamp: new Date().toISOString(),
              tests: accessibilityChecks,
              summary: {
                passed: accessibilityChecks.filter(t => t.status === 'passed').length,
                warnings: accessibilityChecks.filter(t => t.status === 'warning').length,
                failed: accessibilityChecks.filter(t => t.status === 'failed').length,
                total: accessibilityChecks.length
              }
            };

            await fs.writeFile('./tests/reports/accessibility-report.json', JSON.stringify(report, null, 2));
            console.log('Accessibility tests completed');

          } finally {
            await browser.close();
          }
        })();
      `;

      await fs.writeFile('./tests/accessibility-test-temp.js', accessibilityScript);
      await this.runCommand('node', ['./tests/accessibility-test-temp.js']);
      await fs.unlink('./tests/accessibility-test-temp.js');

      const reportPath = './tests/reports/accessibility-report.json';
      if (await this.fileExists(reportPath)) {
        const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
        this.results.testSuites.push({
          name: 'Accessibility Tests',
          status: 'completed',
          summary: report.summary,
          reportPath: reportPath
        });
      }

      console.log('✅ Accessibility tests completed');
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error.message);
      this.results.testSuites.push({
        name: 'Accessibility Tests',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runTestScript(scriptPath) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const child = spawn('node', [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data;
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        stderr += data;
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        const duration = Date.now() - startTime;

        if (code === 0) {
          resolve({ code, stdout, stderr, duration });
        } else {
          reject(new Error(`Test script failed with code ${code}\\n${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data;
      });

      child.stderr.on('data', (data) => {
        stderr += data;
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ code, stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}\\n${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async generateMasterReport() {
    console.log('\n📊 Generating Master Test Report...');

    // Calculate overall summary
    this.results.overallSummary.duration = Date.now() - this.startTime;

    this.results.testSuites.forEach(suite => {
      if (suite.summary) {
        this.results.overallSummary.totalTests += suite.summary.total || 0;
        this.results.overallSummary.passed += suite.summary.passed || 0;
        this.results.overallSummary.failed += suite.summary.failed || 0;
        this.results.overallSummary.warnings += suite.summary.warnings || 0;
      }
    });

    // Generate JSON report
    await fs.writeFile(
      './tests/reports/master-test-report.json',
      JSON.stringify(this.results, null, 2)
    );

    // Generate HTML master report
    const htmlReport = this.generateMasterHTMLReport();
    await fs.writeFile(
      './tests/reports/master-test-report.html',
      htmlReport
    );

    // Generate README for the test results
    const readme = this.generateTestReadme();
    await fs.writeFile('./tests/README.md', readme);

    console.log('✅ Master test report generated');
  }

  generateMasterHTMLReport() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nugi Home Knifecraft - Master Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 15px; margin-bottom: 30px; text-align: center; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .summary-card { background: white; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .summary-card h3 { font-size: 2.5rem; margin-bottom: 10px; }
        .summary-card.passed h3 { color: #10b981; }
        .summary-card.failed h3 { color: #ef4444; }
        .summary-card.warnings h3 { color: #f59e0b; }
        .summary-card.total h3 { color: #6366f1; }
        .test-suites { display: grid; gap: 20px; }
        .suite-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .suite-header { padding: 20px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
        .suite-content { padding: 20px; }
        .status { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status.completed { background: #d1fae5; color: #065f46; }
        .status.failed { background: #fee2e2; color: #991b1b; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 15px; }
        .metric { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 1.5rem; font-weight: bold; color: #374151; }
        .metric-label { font-size: 0.875rem; color: #6b7280; margin-top: 5px; }
        .report-links { margin-top: 20px; }
        .report-link { display: inline-block; margin-right: 10px; padding: 8px 16px; background: #e0e7ff; color: #3730a3; text-decoration: none; border-radius: 6px; font-size: 14px; }
        .footer { margin-top: 40px; padding: 30px; background: white; border-radius: 10px; text-align: center; }
        .recommendations { background: #fef7cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Nugi Home Knifecraft</h1>
            <h2>Master Test Report</h2>
            <p>Comprehensive Testing Suite Results</p>
            <p><small>Generated: ${this.results.timestamp}</small></p>
        </div>

        <div class="summary">
            <div class="summary-card total">
                <h3>${this.results.overallSummary.totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed">
                <h3>${this.results.overallSummary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${this.results.overallSummary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card warnings">
                <h3>${this.results.overallSummary.warnings}</h3>
                <p>Warnings</p>
            </div>
        </div>

        <div class="test-suites">
            ${this.results.testSuites.map(suite => `
                <div class="suite-card">
                    <div class="suite-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3>${suite.name}</h3>
                            <span class="status ${suite.status}">${suite.status}</span>
                        </div>
                    </div>
                    <div class="suite-content">
                        ${suite.summary ? `
                            <div class="metrics">
                                <div class="metric">
                                    <div class="metric-value">${suite.summary.passed}</div>
                                    <div class="metric-label">Passed</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${suite.summary.failed}</div>
                                    <div class="metric-label">Failed</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${suite.summary.warnings || 0}</div>
                                    <div class="metric-label">Warnings</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${suite.summary.total}</div>
                                    <div class="metric-label">Total</div>
                                </div>
                            </div>
                        ` : ''}

                        ${suite.error ? `
                            <div style="color: #dc2626; margin-top: 10px;">
                                <strong>Error:</strong> ${suite.error}
                            </div>
                        ` : ''}

                        ${suite.reportPath ? `
                            <div class="report-links">
                                <a href="${suite.reportPath.replace('./tests/', '')}" class="report-link">📄 View Detailed Report</a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="recommendations">
            <h3>🎯 Key Recommendations</h3>
            <ul style="margin-top: 15px; padding-left: 20px;">
                <li><strong>WhatsApp Integration:</strong> Verify both phone numbers are correct and test message formatting</li>
                <li><strong>Social Media:</strong> Create social media accounts if they don't exist yet</li>
                <li><strong>Performance:</strong> Monitor page load times and optimize if necessary</li>
                <li><strong>Accessibility:</strong> Ensure all images have alt text and forms have proper labels</li>
                <li><strong>Mobile Experience:</strong> Test thoroughly on actual mobile devices</li>
            </ul>
        </div>

        <div class="footer">
            <h3>📊 Test Summary</h3>
            <p>Total Duration: ${Math.round(this.results.overallSummary.duration / 1000)}s</p>
            <p>Success Rate: ${Math.round((this.results.overallSummary.passed / this.results.overallSummary.totalTests) * 100)}%</p>
            <div style="margin-top: 20px;">
                <a href="reports/" class="report-link">📁 View All Reports</a>
                <a href="screenshots/" class="report-link">📸 View Screenshots</a>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateTestReadme() {
    return `# Nugi Home Knifecraft - Test Results

Generated: ${this.results.timestamp}

## Summary

- **Total Tests:** ${this.results.overallSummary.totalTests}
- **Passed:** ${this.results.overallSummary.passed}
- **Failed:** ${this.results.overallSummary.failed}
- **Warnings:** ${this.results.overallSummary.warnings}
- **Duration:** ${Math.round(this.results.overallSummary.duration / 1000)}s

## Test Suites

${this.results.testSuites.map(suite => `
### ${suite.name}
- **Status:** ${suite.status}
${suite.summary ? `- **Results:** ${suite.summary.passed} passed, ${suite.summary.failed} failed, ${suite.summary.warnings || 0} warnings` : ''}
${suite.reportPath ? `- **Report:** [View Details](${suite.reportPath})` : ''}
${suite.error ? `- **Error:** ${suite.error}` : ''}
`).join('')}

## Generated Reports

- [Master Report](reports/master-test-report.html)
- [Page Navigation Report](reports/page-navigation-report.html)
- [WhatsApp & Social Media Report](reports/whatsapp-social-report.html)
- [API Tests Report](reports/api-tests-report.json)
- [Accessibility Report](reports/accessibility-report.json)

## Screenshots

All test screenshots are available in the \`screenshots/\` directory.

## Running Tests

To run these tests again:

\`\`\`bash
node tests/run-all-tests.js
\`\`\`

## Notes

${this.results.overallSummary.failed > 0 ? '⚠️ Some tests failed. Please review the detailed reports.' : '✅ All tests passed successfully!'}

Make sure your development server is running on http://localhost:3000 before running tests.
`;
  }

  printFinalSummary() {
    console.log('\n' + '━'.repeat(80));
    console.log('🎉 COMPREHENSIVE TESTING COMPLETE');
    console.log('━'.repeat(80));
    console.log(`📊 Overall Results:`);
    console.log(`   Total Tests: ${this.results.overallSummary.totalTests}`);
    console.log(`   ✅ Passed: ${this.results.overallSummary.passed}`);
    console.log(`   ❌ Failed: ${this.results.overallSummary.failed}`);
    console.log(`   ⚠️  Warnings: ${this.results.overallSummary.warnings}`);
    console.log(`   ⏱️  Duration: ${Math.round(this.results.overallSummary.duration / 1000)}s`);
    console.log(`   📈 Success Rate: ${Math.round((this.results.overallSummary.passed / this.results.overallSummary.totalTests) * 100)}%`);
    console.log('\n📄 Generated Reports:');
    console.log('   - ./tests/reports/master-test-report.html (Main Report)');
    console.log('   - ./tests/reports/ (All detailed reports)');
    console.log('   - ./tests/screenshots/ (All screenshots)');
    console.log('   - ./tests/README.md (Summary)');
    console.log('\n🔍 Next Steps:');
    console.log('   1. Review the master report in your browser');
    console.log('   2. Check any failed tests and fix issues');
    console.log('   3. Verify WhatsApp numbers and social media links');
    console.log('   4. Test on actual mobile devices');
    console.log('━'.repeat(80));
  }
}

// Run the master test suite
if (require.main === module) {
  const runner = new MasterTestRunner();
  runner.runAllTests().catch(console.error);
}

module.exports = MasterTestRunner;