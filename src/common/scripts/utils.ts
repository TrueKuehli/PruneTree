/**
 * Parses a string or number representing a database ID and returns it
 *   as a number or null if invalid
 * @param id The ID to parse
 * @returns The parsed ID or null if invalid
 */
function parseID(id: string|number): number|null {
  if (typeof id === 'string') {
    id = parseInt(id);
  }

  // Reject if ID is nan, not an integer, or less than 1
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}


export {
  parseID,
};
