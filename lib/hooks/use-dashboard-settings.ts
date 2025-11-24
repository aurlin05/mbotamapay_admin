import { useState, useEffect, useCallback } from 'react';

export type CardId = 'total-users' | 'active-users' | 'total-transactions' | 'total-volume';

export interface DashboardSettings {
  cardOrder: CardId[];
  hiddenCards: CardId[];
}

const DEFAULT_SETTINGS: DashboardSettings = {
  cardOrder: ['total-users', 'active-users', 'total-transactions', 'total-volume'],
  hiddenCards: [],
};

const STORAGE_KEY = 'mbotamapay-dashboard-settings';

export function useDashboardSettings() {
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardSettings;
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load dashboard settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = useCallback((newSettings: DashboardSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save dashboard settings:', error);
    }
  }, []);

  // Reorder cards
  const reorderCards = useCallback(
    (newOrder: CardId[]) => {
      saveSettings({
        ...settings,
        cardOrder: newOrder,
      });
    },
    [settings, saveSettings]
  );

  // Hide a card
  const hideCard = useCallback(
    (cardId: CardId) => {
      if (!settings.hiddenCards.includes(cardId)) {
        saveSettings({
          ...settings,
          hiddenCards: [...settings.hiddenCards, cardId],
        });
      }
    },
    [settings, saveSettings]
  );

  // Show a card
  const showCard = useCallback(
    (cardId: CardId) => {
      saveSettings({
        ...settings,
        hiddenCards: settings.hiddenCards.filter((id) => id !== cardId),
      });
    },
    [settings, saveSettings]
  );

  // Toggle card visibility
  const toggleCardVisibility = useCallback(
    (cardId: CardId) => {
      if (settings.hiddenCards.includes(cardId)) {
        showCard(cardId);
      } else {
        hideCard(cardId);
      }
    },
    [settings.hiddenCards, showCard, hideCard]
  );

  // Reset to default settings
  const resetToDefaults = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  // Check if a card is visible
  const isCardVisible = useCallback(
    (cardId: CardId) => {
      return !settings.hiddenCards.includes(cardId);
    },
    [settings.hiddenCards]
  );

  // Get visible cards in order
  const visibleCards = useCallback(() => {
    return settings.cardOrder.filter((cardId) => !settings.hiddenCards.includes(cardId));
  }, [settings.cardOrder, settings.hiddenCards]);

  return {
    settings,
    isLoaded,
    reorderCards,
    hideCard,
    showCard,
    toggleCardVisibility,
    resetToDefaults,
    isCardVisible,
    visibleCards,
  };
}
