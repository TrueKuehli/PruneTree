import React from 'react'

export default () => {
  return (
    <div>
      <h2>Some Stats We're Proud Of</h2>
      <p>Looks like our user have been busy creating trees so we thought we should share some stats so you can see just how busy our users have been.</p>
      <table className='table' style={{ maxWidth: 500, margin: '20px auto' }}>
        <tbody>
          <tr>
            <th>Users Signed Up</th>
            <td>120,000+</td>
          </tr>
          <tr>
            <th>Trees Created</th>
            <td>250,000+</td>
          </tr>
          <tr>
            <th>Trees Published</th>
            <td>40,000+</td>
          </tr>
          <tr>
            <th>Images Uploaded</th>
            <td>2,000,000+</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
