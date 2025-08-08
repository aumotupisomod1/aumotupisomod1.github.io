// Sponsors页面的逻辑
class SponsorsApp {
  constructor() {
    this.currentLang = 'en';
    this.translations = {};
    this.langSelectEl = null;
    
    this.init();
  }

  async init() {
    await this.loadTranslations();
    await this.loadCommonComponents();
    this.setupEventListeners();
    this.updateTexts();
  }

  async loadTranslations() {
    try {
      const response = await fetch('../locales/translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  async loadCommonComponents() {
    try {
      // 加载头部
      const headerResponse = await fetch('../common/header.html');
      const headerHtml = await headerResponse.text();
      const headerContainer = document.querySelector('.header-container');
      if (headerContainer) {
        headerContainer.innerHTML = headerHtml;
        
        // 修正导航链接的路径（因为我们在sponsors子目录中）
        const homeLink = headerContainer.querySelector('a[data-i18n="nav.home"]');
        const aboutLink = headerContainer.querySelector('a[data-i18n="nav.about"]');
        const sponsorsLink = headerContainer.querySelector('a[data-i18n="nav.sponsors"]');
        
        if (homeLink) homeLink.href = '../index.html';
        if (aboutLink) aboutLink.href = '../about.html';
        if (sponsorsLink) sponsorsLink.href = 'index.html';
      }

      // 加载页脚
      const footerResponse = await fetch('../common/footer.html');
      const footerHtml = await footerResponse.text();
      const footerContainer = document.querySelector('.footer-container');
      if (footerContainer) {
        footerContainer.innerHTML = footerHtml;
      }

      // 重新获取元素引用
      this.langSelectEl = document.getElementById('langSelect');
    } catch (error) {
      console.error('Error loading common components:', error);
    }
  }

  setupEventListeners() {
    if (this.langSelectEl) {
      this.langSelectEl.addEventListener('change', (e) => {
        this.currentLang = e.target.value;
        this.updateTexts();
      });
    }
  }

  getTranslation(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 返回原始key如果翻译不存在
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  updateTexts() {
    // 更新带有data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      el.textContent = translation;
    });

    // 更新占位符文本
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.getTranslation(key);
      el.setAttribute('placeholder', translation);
    });

    // 更新aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const translation = this.getTranslation(key);
      el.setAttribute('aria-label', translation);
    });
  }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new SponsorsApp();
});
