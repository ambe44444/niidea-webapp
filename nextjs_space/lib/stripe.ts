import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-06-24.dahlia' as any,
});

export const LEVEL_PRICES: Record<string, number> = {
  soft: 2500,
  medium: 3000,
  full: 3500,
};

export const LEVEL_LABELS: Record<string, string> = {
  soft: 'Soft',
  medium: 'Medium',
  full: 'Full',
};
