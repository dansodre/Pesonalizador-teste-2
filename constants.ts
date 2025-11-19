import { ProductTemplate } from './types';

// Helper to get env vars safely across Vite/CRA/Browser
const getEnv = (key: string, viteKey: string) => {
  // 1. Try import.meta.env (Vite)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      // @ts-ignore
      return import.meta.env[viteKey];
    }
  } catch (e) {}

  // 2. Try process.env (CRA/Next)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

// Supabase Configuration
export const SUPABASE_URL = getEnv('REACT_APP_SUPABASE_URL', 'VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('REACT_APP_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

// Checkout Redirect URL
export const CHECKOUT_REDIRECT_URL = 'https://vemcolando.com.br/checkout/confirmacao';

// Editor Defaults
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_TEXT_COLOR = '#000000';
export const DEFAULT_FONT_FAMILY = 'Inter';

export const AVAILABLE_FONTS = [
  { name: 'Padrão', value: 'Inter' },
  { name: 'Manuscrita', value: 'Pacifico' },
  { name: 'Amigável', value: 'Quicksand' },
  { name: 'Serifa', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
];

export const COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316', '#F59E0B', 
  '#84CC16', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', 
  '#8B5CF6', '#EC4899', '#F43F5E'
];

// Product Templates
export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: 'sticker-round',
    name: 'Adesivo Redondo (5cm)',
    width: 500,
    height: 500,
    previewImage: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: 'tag-square',
    name: 'Tag Quadrada (6cm)',
    width: 600,
    height: 600,
    previewImage: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: 'planner-a5',
    name: 'Capa de Planner A5',
    width: 500,
    height: 700,
    previewImage: 'https://picsum.photos/200/280?random=3',
  },
  {
    id: 'mug-wrap',
    name: 'Caneca',
    width: 800,
    height: 350,
    previewImage: 'https://picsum.photos/200/100?random=4',
  }
];