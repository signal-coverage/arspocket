/**
 * Generates initials from a name string or an array of name parts of any length.
 *
 * - Each word (string) or each element (array) contributes its first letter.
 * - Returns "?" if the input is null, undefined, or empty.
 *
 * @param {string | string[] | null | undefined} name - Full name string or array of name parts.
 * @returns {string} Uppercase initials, or "?" if no valid name is provided.
 */
export const getInitials = (
  name: string | string[] | null | undefined,
): string => {
  if (!name) return "?";
  const parts = Array.isArray(name)
    ? name.filter(Boolean)
    : name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.map((part) => part[0].toUpperCase()).join("");
};
