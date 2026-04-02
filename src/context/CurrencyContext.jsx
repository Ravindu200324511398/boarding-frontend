import React, { createContext, useContext, useState, useEffect } from 'react';

// ── SUPPORTED CURRENCIES ─────────────────────────────────
export const CURRENCIES = [
  { code: 'LKR', symbol: 'Rs',  flag: '🇱🇰', name: 'Sri Lankan Rupee',  rate: 1        },
  { code: 'USD', symbol: '$',   flag: '🇺🇸', name: 'US Dollar',          rate: 0.0031   },
  { code: 'EUR', symbol: '€',   flag: '🇪🇺', name: 'Euro',               rate: 0.0029   },
  { code: 'GBP', symbol: '£',   flag: '🇬🇧', name: 'British Pound',      rate: 0.0024   },
  { code: 'AUD', symbol: 'A$',  flag: '🇦🇺', name: 'Australian Dollar',  rate: 0.0048   },
  { code: 'INR', symbol: '₹',   flag: '🇮🇳', name: 'Indian Rupee',       rate: 0.26     },
  { code: 'SGD', symbol: 'S$',  flag: '🇸🇬', name: 'Singapore Dollar',   rate: 0.0041   },
  { code: 'JPY', symbol: '¥',   flag: '🇯🇵', name: 'Japanese Yen',       rate: 0.46     },
  { code: 'CAD', symbol: 'C$',  flag: '🇨🇦', name: 'Canadian Dollar',    rate: 0.0043   },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham',         rate: 0.011    },
];

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('bf_currency');
    return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0];
  });

  const changeCurrency = (code) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrency(found);
      localStorage.setItem('bf_currency', code);
    }
  };

  // Convert a LKR amount to the selected currency
  const convert = (lkrAmount) => {
    if (!lkrAmount && lkrAmount !== 0) return null;
    return lkrAmount * currency.rate;
  };

  // Format a converted amount nicely
  const format = (lkrAmount) => {
    if (!lkrAmount && lkrAmount !== 0) return '—';
    const converted = convert(lkrAmount);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 0,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 0,
    }).format(Math.round(converted));
    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convert, format, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);