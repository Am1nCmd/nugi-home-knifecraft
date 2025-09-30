/**
 * WhatsApp and Social Media Links Testing
 * Comprehensive validation of external communication channels
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class WhatsAppSocialTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      timestamp: new Date().toISOString(),
      whatsappTests: [],
      socialMediaTests: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    };
  }

  async runTests() {
    console.log('🔗 Starting WhatsApp & Social Media Link Tests');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      await this.testWhatsAppButtons(browser);
      await this.testSocialMediaLinks(browser);
      await this.generateReport();
    } finally {
      await browser.close();
    }

    this.printSummary();
  }

  async testWhatsAppButtons(browser) {
    console.log('\n📱 Testing WhatsApp Integration...');

    const page = await browser.newPage();
    await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    // Test 1: WhatsApp button presence in homepage
    const whatsappButtonsHomepage = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons
        .filter(btn =>
          btn.textContent.toLowerCase().includes('whatsapp') ||
          btn.textContent.toLowerCase().includes('beli via') ||
          btn.getAttribute('href')?.includes('wa.me')
        )
        .map(btn => ({
          text: btn.textContent.trim(),
          href: btn.getAttribute('href'),
          tagName: btn.tagName.toLowerCase(),
          isVisible: !!(btn.offsetWidth || btn.offsetHeight || btn.getClientRects().length)
        }));
    });

    this.results.whatsappTests.push({
      test: 'WhatsApp Buttons - Homepage',
      status: whatsappButtonsHomepage.length > 0 ? 'passed' : 'warning',
      found: whatsappButtonsHomepage.length,
      details: whatsappButtonsHomepage
    });

    // Test 2: Navigate to products page and test WhatsApp buttons there
    await page.goto(`${this.baseUrl}/products`, { waitUntil: 'networkidle0' });

    const whatsappButtonsProducts = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons
        .filter(btn =>
          btn.textContent.toLowerCase().includes('whatsapp') ||
          btn.textContent.toLowerCase().includes('beli via') ||
          btn.getAttribute('href')?.includes('wa.me')
        )
        .map(btn => ({
          text: btn.textContent.trim(),
          href: btn.getAttribute('href'),
          tagName: btn.tagName.toLowerCase(),
          isVisible: !!(btn.offsetWidth || btn.offsetHeight || btn.getClientRects().length)
        }));
    });

    this.results.whatsappTests.push({
      test: 'WhatsApp Buttons - Products Page',
      status: whatsappButtonsProducts.length > 0 ? 'passed' : 'warning',
      found: whatsappButtonsProducts.length,
      details: whatsappButtonsProducts
    });

    // Test 3: Click WhatsApp button and verify URL format
    if (whatsappButtonsProducts.length > 0) {
      try {
        // Override window.open to capture the URL
        await page.evaluateOnNewDocument(() => {
          window.whatsappUrls = [];
          const originalOpen = window.open;
          window.open = function(url, target, features) {
            window.whatsappUrls.push(url);
            return { focus: () => {}, close: () => {} };
          };
        });

        // Click the first WhatsApp button using a more reliable approach
        const whatsappButtonFound = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const whatsappButton = buttons.find(btn =>
            btn.textContent.includes('Beli via WhatsApp') ||
            btn.textContent.includes('WhatsApp')
          );

          if (whatsappButton) {
            whatsappButton.click();
            return true;
          }
          return false;
        });

        if (whatsappButtonFound) {

          // Check captured URLs
          const capturedUrls = await page.evaluate(() => window.whatsappUrls || []);

          this.results.whatsappTests.push({
            test: 'WhatsApp Button Click Functionality',
            status: capturedUrls.length > 0 ? 'passed' : 'warning',
            capturedUrls: capturedUrls,
            buttonFound: true,
            details: 'WhatsApp button found and clicked successfully. URL capture depends on actual WhatsApp integration.'
          });
        }
      } catch (error) {
        this.results.whatsappTests.push({
          test: 'WhatsApp Button Click Functionality',
          status: 'failed',
          error: error.message
        });
      }
    }

    // Test 4: Validate WhatsApp number formats
    const whatsappNumbers = [
      { number: '6281199214', location: 'Purchase buttons' },
      { number: '6281199921', location: 'Footer contact' }
    ];

    for (const whatsappNumber of whatsappNumbers) {
      const pageContent = await page.content();
      const numberFound = pageContent.includes(whatsappNumber.number);

      this.results.whatsappTests.push({
        test: `WhatsApp Number Validation - ${whatsappNumber.location}`,
        status: numberFound ? 'passed' : 'warning',
        number: whatsappNumber.number,
        found: numberFound,
        details: `Checking for number ${whatsappNumber.number} in ${whatsappNumber.location}`
      });
    }

    await page.close();
  }

  async testSocialMediaLinks(browser) {
    console.log('\n📢 Testing Social Media Links...');

    const page = await browser.newPage();
    await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    const socialMediaExpected = [
      { name: 'Instagram', pattern: 'instagram.com/nugihomeknifecraft', icon: 'instagram' },
      { name: 'Facebook', pattern: 'facebook.com/nugihomeknifecraft', icon: 'facebook' },
      { name: 'YouTube', pattern: 'youtube.com/@nugihomeknifecraft', icon: 'youtube' }
    ];

    // Test social media links in footer
    const socialLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('footer a'));
      return links
        .filter(link =>
          link.href.includes('instagram') ||
          link.href.includes('facebook') ||
          link.href.includes('youtube')
        )
        .map(link => ({
          href: link.href,
          text: link.textContent.trim(),
          target: link.target,
          hasIcon: link.querySelector('svg') !== null,
          isVisible: !!(link.offsetWidth || link.offsetHeight || link.getClientRects().length)
        }));
    });

    this.results.socialMediaTests.push({
      test: 'Social Media Links - Footer',
      status: socialLinks.length >= 3 ? 'passed' : 'warning',
      found: socialLinks.length,
      expected: 3,
      details: socialLinks
    });

    // Test each expected social media platform
    for (const social of socialMediaExpected) {
      const found = socialLinks.some(link => link.href.includes(social.pattern));

      this.results.socialMediaTests.push({
        test: `${social.name} Link Validation`,
        status: found ? 'passed' : 'warning',
        platform: social.name,
        expectedPattern: social.pattern,
        found: found,
        note: found ? 'Link found in footer - accounts to be created later' : 'Link not found - may need to be created'
      });
    }

    // Test social media link behavior
    for (const link of socialLinks) {
      try {
        // Check if links open in new tab
        const opensInNewTab = link.target === '_blank' || link.target === '_new';

        this.results.socialMediaTests.push({
          test: `Link Behavior - ${this.getSocialPlatform(link.href)}`,
          status: opensInNewTab ? 'passed' : 'warning',
          href: link.href,
          opensInNewTab: opensInNewTab,
          hasIcon: link.hasIcon,
          details: opensInNewTab ? 'Opens in new tab' : 'Opens in same tab (consider changing to new tab)'
        });
      } catch (error) {
        this.results.socialMediaTests.push({
          test: `Link Behavior Test - ${link.href}`,
          status: 'failed',
          error: error.message
        });
      }
    }

    await page.close();
  }

  getSocialPlatform(url) {
    if (url.includes('instagram')) return 'Instagram';
    if (url.includes('facebook')) return 'Facebook';
    if (url.includes('youtube')) return 'YouTube';
    if (url.includes('wa.me')) return 'WhatsApp';
    return 'Unknown';
  }

  async generateReport() {
    console.log('\n📊 Generating WhatsApp & Social Media Test Report...');

    // Calculate summary
    const allTests = [...this.results.whatsappTests, ...this.results.socialMediaTests];
    this.results.summary = {
      passed: allTests.filter(t => t.status === 'passed').length,
      failed: allTests.filter(t => t.status === 'failed').length,
      warnings: allTests.filter(t => t.status === 'warning').length,
      total: allTests.length
    };

    // Create directory if it doesn't exist
    await fs.mkdir('./tests/reports', { recursive: true });

    // Generate detailed JSON report
    await fs.writeFile(
      './tests/reports/whatsapp-social-report.json',
      JSON.stringify(this.results, null, 2)
    );

    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    await fs.writeFile(
      './tests/reports/whatsapp-social-report.html',
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
    <title>WhatsApp & Social Media Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
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
        .link-item { background: #f8fafc; padding: 8px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
        pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 WhatsApp & Social Media Test Report</h1>
            <p>Nugi Home Knifecraft - External Communication Testing</p>
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
            <div class="section-header">📱 WhatsApp Integration Tests</div>
            ${this.results.whatsappTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    ${test.details ? `
                        <div class="details">
                            ${Array.isArray(test.details) ?
                                test.details.map(detail => `
                                    <div class="link-item">
                                        <strong>Text:</strong> ${detail.text}<br>
                                        <strong>Href:</strong> ${detail.href || 'N/A'}<br>
                                        <strong>Visible:</strong> ${detail.isVisible ? 'Yes' : 'No'}
                                    </div>
                                `).join('') :
                                `<p>${test.details}</p>`
                            }
                            ${test.found !== undefined ? `<p><strong>Found:</strong> ${test.found} items</p>` : ''}
                            ${test.capturedUrls ? `<p><strong>Captured URLs:</strong> ${test.capturedUrls.join(', ')}</p>` : ''}
                            ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>

        <div class="test-section">
            <div class="section-header">📢 Social Media Links Tests</div>
            ${this.results.socialMediaTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    ${test.details ? `
                        <div class="details">
                            ${Array.isArray(test.details) ?
                                test.details.map(detail => `
                                    <div class="link-item">
                                        <strong>URL:</strong> ${detail.href}<br>
                                        <strong>Text:</strong> ${detail.text}<br>
                                        <strong>Target:</strong> ${detail.target || 'Same tab'}<br>
                                        <strong>Has Icon:</strong> ${detail.hasIcon ? 'Yes' : 'No'}<br>
                                        <strong>Visible:</strong> ${detail.isVisible ? 'Yes' : 'No'}
                                    </div>
                                `).join('') :
                                `<p>${test.details}</p>`
                            }
                            ${test.platform ? `<p><strong>Platform:</strong> ${test.platform}</p>` : ''}
                            ${test.expectedPattern ? `<p><strong>Expected Pattern:</strong> ${test.expectedPattern}</p>` : ''}
                            ${test.note ? `<p><strong>Note:</strong> ${test.note}</p>` : ''}
                            ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>

        <div class="test-section">
            <div class="section-header">📋 Recommendations</div>
            <div class="test-item">
                <h4>WhatsApp Integration:</h4>
                <ul>
                    <li>✅ Verify both WhatsApp numbers are correct (+6281199214 for purchases, +6281199921 for general contact)</li>
                    <li>✅ Consider adding WhatsApp buttons to more product pages for better conversion</li>
                    <li>✅ Test WhatsApp message formatting with actual phone numbers</li>
                </ul>

                <h4>Social Media:</h4>
                <ul>
                    <li>⚠️ Create social media accounts if they don't exist yet:
                        <ul>
                            <li>Instagram: @nugihomeknifecraft</li>
                            <li>Facebook: nugihomeknifecraft</li>
                            <li>YouTube: @nugihomeknifecraft</li>
                        </ul>
                    </li>
                    <li>✅ Ensure all social media links open in new tabs</li>
                    <li>✅ Add social media icons for better visual recognition</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  printSummary() {
    console.log('\n📊 WhatsApp & Social Media Test Summary:');
    console.log('━'.repeat(50));
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`📊 Total: ${this.results.summary.total}`);
    console.log('\n📄 Reports generated:');
    console.log('  - ./tests/reports/whatsapp-social-report.html');
    console.log('  - ./tests/reports/whatsapp-social-report.json');
  }
}

// Run the tests
if (require.main === module) {
  const tester = new WhatsAppSocialTester();
  tester.runTests().catch(console.error);
}

module.exports = WhatsAppSocialTester;