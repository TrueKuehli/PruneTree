import { decode } from 'jsonwebtoken'
import { toast } from 'react-toastify'
import get from 'lodash.get'

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
  },

  /**
   * Checks if a error given is a axios error with a response code of 403. If so
   * we redirect the user to login and let them know they need to sign in again.
   * @param {Object} error
   * @param {Object} navigate
   * @returns
   */
  loginRequired: (error, navigate) => {
    if (get(error, 'response.status') === 403) {
      localStorage.removeItem('token')
      toast.warn('You\'re session expired. Please login again.')
      navigate('/login')
      return true
    }
    return false
  }
}
