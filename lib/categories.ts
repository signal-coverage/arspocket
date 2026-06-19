/**
 * Predefined category lists shared across Budget forms and Transaction forms.
 * Both features must reference these arrays so the options are always in sync.
 */

export const EXPENSE_CATEGORIES: readonly string[] = [
  "Food & Dining",
  "Transport",
  "Housing",
  "Utilities",
  "Health",
  "Entertainment",
  "Shopping",
  "Education",
  "Travel",
  "Clothing",
  "Personal Care",
  "Subscriptions",
  "Insurance",
  "Savings",
  "Other",
] as const;

export const INCOME_CATEGORIES: readonly string[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Rental",
  "Business",
  "Gift",
  "Other",
] as const;

/**
 * All categories combined — used by Budget form (category select)
 * and Transaction form (category select) for a unified list.
 */
export const ALL_CATEGORIES: readonly string[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
] as const;

/**
 * Alias exported as CATEGORIES for backward-compat with any existing usage.
 */
export const CATEGORIES = ALL_CATEGORIES;
