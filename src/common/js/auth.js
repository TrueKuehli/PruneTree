import { decode } from 'jsonwebtoken'

/**
 * Util object for dealing with the auth token.
 */
export default {
  /**
   * Save auth token to local storage
   * @param  {string} token JWT token to save
   * @return {void}
   */
  saveToken: (token) => {
    localStorage.setItem('token', token)
  },

  /**
   * Get the auth token from local storage and decode to get the claims
   * @return {object} JWT claims object
   */
  getSession: () => {
    return decode(localStorage.getItem('token'))
  },

  /**
   * Get the raw JWT token from local storage
   * @return {string} JWT token
   */
  getToken: () => {
    return localStorage.getItem('token')
  },

  /**
   * Delete the token from local storage
   * @return {void}
   */
  clearToken: () => {
    localStorage.removeItem('token')
  }
}
