export const loadLanguage = async (languageCode) => {
    try {
      const language = await import(`../data/languages/${languageCode}.json`);
      return language.default;
    } catch (error) {
      console.error(`Failed to load language: ${languageCode}`, error);
      // Fallback to English if the requested language fails to load
      const english = await import('../data/languages/english.json');
      return english.default;
    }
  };