"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import messages
import en from '../../messages/en.json';
import ru from '../../messages/ru.json';
import uz from '../../messages/uz.json';

type Locale = 'en' | 'ru' | 'uz';

const messages = { en, ru, uz };

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Helper to get nested value from object by dot-notation key
function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key];
        } else {
            return path; // Return key if not found
        }
    }

    return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        // Load saved locale from localStorage
        const savedLocale = localStorage.getItem('stride-locale') as Locale;
        if (savedLocale && ['en', 'ru', 'uz'].includes(savedLocale)) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('stride-locale', newLocale);
    };

    const t = (key: string): string => {
        return getNestedValue(messages[locale] as Record<string, unknown>, key);
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }
    return context;
}

export function useLocale() {
    const { locale, setLocale } = useTranslation();
    return { locale, setLocale };
}
