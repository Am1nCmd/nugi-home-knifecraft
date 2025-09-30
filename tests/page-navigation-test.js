/**
 * Page Navigation and UI Component Testing
 * Comprehensive validation of all pages, components, and user interactions
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class PageNavigationTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      timestamp: new Date().toISOString(),
      navigationTests: [],
      componentTests: [],
      responsiveTests: [],
      performanceTests: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    };
  }

  async runTests() {
    console.log('🧭 Starting Page Navigation & UI Component Tests');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      await this.testPageNavigation(browser);
      await this.testUIComponents(browser);
      await this.testResponsiveDesign(browser);
      await this.testPerformance(browser);
      await this.generateReport();
    } finally {
      await browser.close();
    }

    this.printSummary();
  }

  async testPageNavigation(browser) {
    console.log('\n📄 Testing Page Navigation...');

    const pages = [
      { name: 'Homepage', path: '/', expectedElements: ['header', 'nav', 'main', 'footer'] },
      { name: 'Products', path: '/products', expectedElements: ['header', 'main', '.product-grid'] },
      { name: 'Blog', path: '/blog', expectedElements: ['header', 'main', '.article'] },
      { name: 'About', path: '/about', expectedElements: ['header', 'main'] },
      { name: 'Admin Login', path: '/admin/login', expectedElements: ['form', 'input'] }
    ];

    for (const pageTest of pages) {
      const page = await browser.newPage();

      try {
        console.log(`  Testing: ${pageTest.name}`);

        // Navigate to page
        const response = await page.goto(`${this.baseUrl}${pageTest.path}`, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        // Check response status
        const statusOk = response.status() >= 200 && response.status() < 400;

        // Check page title
        const title = await page.title();
        const hasTitle = title && title.length > 0;

        // Check for expected elements
        const elementChecks = {};
        for (const selector of pageTest.expectedElements) {
          try {
            const element = await page.$(selector);
            elementChecks[selector] = element !== null;
          } catch (error) {
            elementChecks[selector] = false;
          }
        }

        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Take screenshot
        await fs.mkdir('./tests/screenshots', { recursive: true });
        const screenshotPath = `./tests/screenshots/page-${pageTest.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        // Check navigation links
        const navigationLinks = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('header nav a, nav a'));
          return links.map(link => ({
            text: link.textContent.trim(),
            href: link.getAttribute('href'),
            isActive: link.classList.contains('active') || link.getAttribute('aria-current') === 'page'
          }));
        });

        const testResult = {
          test: `Page Navigation - ${pageTest.name}`,
          status: statusOk && hasTitle ? 'passed' : 'failed',
          path: pageTest.path,
          statusCode: response.status(),
          title: title,
          hasTitle: hasTitle,
          elementChecks: elementChecks,
          navigationLinks: navigationLinks,
          consoleErrors: consoleErrors,
          screenshot: screenshotPath.replace('./tests/', ''),
          loadTime: Date.now() - page._startTime
        };

        this.results.navigationTests.push(testResult);

      } catch (error) {
        this.results.navigationTests.push({
          test: `Page Navigation - ${pageTest.name}`,
          status: 'failed',
          path: pageTest.path,
          error: error.message
        });
      } finally {
        await page.close();
      }
    }
  }

  async testUIComponents(browser) {
    console.log('\n🔘 Testing UI Components...');

    const page = await browser.newPage();
    await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    // Test Header Component
    const headerTest = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { found: false };

      const logo = header.querySelector('a[href="/"]') || header.querySelector('.logo');
      const navigation = header.querySelector('nav');
      const mobileMenuButton = header.querySelector('[aria-label*="menu"], [aria-label*="Menu"]');

      return {
        found: true,
        hasLogo: !!logo,
        hasNavigation: !!navigation,
        hasMobileMenu: !!mobileMenuButton,
        navigationItems: navigation ? Array.from(navigation.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href')
        })) : []
      };
    });

    this.results.componentTests.push({
      test: 'Header Component',
      status: headerTest.found && headerTest.hasLogo && headerTest.hasNavigation ? 'passed' : 'failed',
      details: headerTest
    });

    // Test Footer Component
    const footerTest = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { found: false };

      const socialLinks = Array.from(footer.querySelectorAll('a')).filter(a =>
        a.href.includes('instagram') || a.href.includes('facebook') || a.href.includes('youtube') || a.href.includes('wa.me')
      );

      const contactInfo = footer.querySelectorAll('[href^="tel:"], [href^="mailto:"]');
      const copyrightText = footer.textContent.includes('2025') || footer.textContent.includes('©');

      return {
        found: true,
        socialLinksCount: socialLinks.length,
        hasContactInfo: contactInfo.length > 0,
        hasCopyright: copyrightText,
        socialLinks: socialLinks.map(link => ({
          href: link.href,
          text: link.textContent.trim()
        }))
      };
    });

    this.results.componentTests.push({
      test: 'Footer Component',
      status: footerTest.found ? 'passed' : 'failed',
      details: footerTest
    });

    // Test Product Cards (if on homepage)
    const productCardsTest = await page.evaluate(() => {
      const productCards = document.querySelectorAll('[data-testid="product-card"], .product-card, .card');
      return {
        found: productCards.length,
        details: Array.from(productCards).slice(0, 3).map(card => ({
          hasImage: !!card.querySelector('img'),
          hasTitle: !!card.querySelector('h2, h3, h4, .title'),
          hasPrice: card.textContent.includes('Rp') || card.textContent.includes('$'),
          hasButton: !!card.querySelector('button, a[role="button"]')
        }))
      };
    });

    this.results.componentTests.push({
      test: 'Product Cards',
      status: productCardsTest.found > 0 ? 'passed' : 'warning',
      details: productCardsTest
    });

    // Test Filter Components
    const filterTest = await page.evaluate(() => {
      const filters = document.querySelectorAll('select, input[type="range"], input[type="checkbox"]');
      const categoryFilter = document.querySelector('[data-testid="category-filter"]') ||
                           document.querySelector('.filter') ||
                           document.querySelector('select');

      return {
        totalFilters: filters.length,
        hasCategoryFilter: !!categoryFilter,
        filterTypes: Array.from(filters).map(filter => ({
          type: filter.type || filter.tagName.toLowerCase(),
          name: filter.name || filter.getAttribute('aria-label') || 'unnamed'
        }))
      };
    });

    this.results.componentTests.push({
      test: 'Filter Components',
      status: filterTest.totalFilters > 0 ? 'passed' : 'warning',
      details: filterTest
    });

    await page.close();
  }

  async testResponsiveDesign(browser) {
    console.log('\n📱 Testing Responsive Design...');

    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Mobile Small', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      const page = await browser.newPage();

      try {
        await page.setViewport({ width: viewport.width, height: viewport.height });
        await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

        // Test mobile menu visibility
        const mobileMenuTest = await page.evaluate((isMobile) => {
          const mobileMenuButton = document.querySelector('[aria-label*="menu"], [aria-label*="Menu"]');
          const desktopNav = document.querySelector('nav.hidden') || document.querySelector('.desktop-nav');

          return {
            mobileMenuButtonVisible: mobileMenuButton ?
              window.getComputedStyle(mobileMenuButton).display !== 'none' : false,
            desktopNavVisible: desktopNav ?
              window.getComputedStyle(desktopNav).display !== 'none' : true,
            isMobileViewport: isMobile
          };
        }, viewport.width <= 768);

        // Test content overflow
        const overflowTest = await page.evaluate(() => {
          const body = document.body;
          const hasHorizontalScroll = body.scrollWidth > body.clientWidth;
          const elementsOverflowing = Array.from(document.querySelectorAll('*')).filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.right > window.innerWidth;
          }).length;

          return {
            hasHorizontalScroll,
            overflowingElements: elementsOverflowing
          };
        });

        // Take screenshot
        const screenshotPath = `./tests/screenshots/responsive-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        this.results.responsiveTests.push({
          test: `Responsive Design - ${viewport.name}`,
          status: !overflowTest.hasHorizontalScroll && overflowTest.overflowingElements === 0 ? 'passed' : 'warning',
          viewport: `${viewport.width}x${viewport.height}`,
          mobileMenuTest,
          overflowTest,
          screenshot: screenshotPath.replace('./tests/', '')
        });

      } catch (error) {
        this.results.responsiveTests.push({
          test: `Responsive Design - ${viewport.name}`,
          status: 'failed',
          viewport: `${viewport.width}x${viewport.height}`,
          error: error.message
        });
      } finally {
        await page.close();
      }
    }
  }

  async testPerformance(browser) {
    console.log('\n⚡ Testing Performance...');

    const page = await browser.newPage();

    try {
      // Enable performance monitoring
      await page.coverage.startJSCoverage();
      await page.coverage.startCSSCoverage();

      const startTime = Date.now();
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;

      // Get performance metrics
      const metrics = await page.metrics();

      // Get Lighthouse-style performance data
      const performanceData = await page.evaluate(() => {
        return {
          timing: performance.timing,
          navigation: performance.navigation,
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          } : null
        };
      });

      // Count resources
      const resourceCount = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const resourceTypes = {};
        resources.forEach(resource => {
          const type = resource.initiatorType || 'other';
          resourceTypes[type] = (resourceTypes[type] || 0) + 1;
        });
        return {
          total: resources.length,
          types: resourceTypes,
          totalSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0)
        };
      });

      // Stop coverage and get reports
      const jsCoverage = await page.coverage.stopJSCoverage();
      const cssCoverage = await page.coverage.stopCSSCoverage();

      const totalBytes = [...jsCoverage, ...cssCoverage].reduce((sum, entry) => sum + entry.text.length, 0);
      const usedBytes = [...jsCoverage, ...cssCoverage].reduce((sum, entry) => {
        return sum + entry.ranges.reduce((rangeSum, range) => rangeSum + range.end - range.start, 0);
      }, 0);

      this.results.performanceTests.push({
        test: 'Homepage Performance',
        status: loadTime < 3000 ? 'passed' : loadTime < 5000 ? 'warning' : 'failed',
        loadTime: loadTime,
        metrics: metrics,
        performanceData: performanceData,
        resourceCount: resourceCount,
        codeUsage: {
          totalBytes: totalBytes,
          usedBytes: usedBytes,
          usagePercentage: Math.round((usedBytes / totalBytes) * 100)
        }
      });

    } catch (error) {
      this.results.performanceTests.push({
        test: 'Homepage Performance',
        status: 'failed',
        error: error.message
      });
    } finally {
      await page.close();
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Page Navigation Test Report...');

    // Calculate summary
    const allTests = [
      ...this.results.navigationTests,
      ...this.results.componentTests,
      ...this.results.responsiveTests,
      ...this.results.performanceTests
    ];

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
      './tests/reports/page-navigation-report.json',
      JSON.stringify(this.results, null, 2)
    );

    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    await fs.writeFile(
      './tests/reports/page-navigation-report.html',
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
    <title>Page Navigation & UI Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
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
        .screenshot-link { display: inline-block; margin: 5px 0; padding: 5px 10px; background: #e0e7ff; color: #3730a3; text-decoration: none; border-radius: 4px; font-size: 12px; }
        .performance-metric { display: inline-block; margin: 5px 10px 5px 0; padding: 5px 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; }
        pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧭 Page Navigation & UI Test Report</h1>
            <p>Nugi Home Knifecraft - Comprehensive UI Testing</p>
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

        <!-- Navigation Tests -->
        <div class="test-section">
            <div class="section-header">📄 Page Navigation Tests</div>
            ${this.results.navigationTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    <div class="details">
                        <p><strong>Path:</strong> ${test.path}</p>
                        <p><strong>Status Code:</strong> ${test.statusCode || 'N/A'}</p>
                        <p><strong>Title:</strong> ${test.title || 'No title'}</p>
                        ${test.loadTime ? `<p><strong>Load Time:</strong> ${test.loadTime}ms</p>` : ''}
                        ${test.screenshot ? `<a href="${test.screenshot}" class="screenshot-link">📸 View Screenshot</a>` : ''}
                        ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Component Tests -->
        <div class="test-section">
            <div class="section-header">🔘 UI Component Tests</div>
            ${this.results.componentTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    <div class="details">
                        <pre>${JSON.stringify(test.details, null, 2)}</pre>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Responsive Tests -->
        <div class="test-section">
            <div class="section-header">📱 Responsive Design Tests</div>
            ${this.results.responsiveTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    <div class="details">
                        <p><strong>Viewport:</strong> ${test.viewport}</p>
                        ${test.screenshot ? `<a href="${test.screenshot}" class="screenshot-link">📸 View Screenshot</a>` : ''}
                        ${test.overflowTest ? `
                            <p><strong>Horizontal Scroll:</strong> ${test.overflowTest.hasHorizontalScroll ? 'Yes ⚠️' : 'No ✅'}</p>
                            <p><strong>Overflowing Elements:</strong> ${test.overflowTest.overflowingElements}</p>
                        ` : ''}
                        ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Performance Tests -->
        <div class="test-section">
            <div class="section-header">⚡ Performance Tests</div>
            ${this.results.performanceTests.map(test => `
                <div class="test-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${test.test}</strong>
                        <span class="status ${test.status}">${test.status}</span>
                    </div>
                    <div class="details">
                        ${test.loadTime ? `<span class="performance-metric">Load Time: ${test.loadTime}ms</span>` : ''}
                        ${test.resourceCount ? `<span class="performance-metric">Resources: ${test.resourceCount.total}</span>` : ''}
                        ${test.codeUsage ? `<span class="performance-metric">Code Usage: ${test.codeUsage.usagePercentage}%</span>` : ''}
                        ${test.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${test.error}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  }

  printSummary() {
    console.log('\n📊 Page Navigation & UI Test Summary:');
    console.log('━'.repeat(50));
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`📊 Total: ${this.results.summary.total}`);
    console.log('\n📄 Reports generated:');
    console.log('  - ./tests/reports/page-navigation-report.html');
    console.log('  - ./tests/reports/page-navigation-report.json');
  }
}

// Run the tests
if (require.main === module) {
  const tester = new PageNavigationTester();
  tester.runTests().catch(console.error);
}

module.exports = PageNavigationTester;