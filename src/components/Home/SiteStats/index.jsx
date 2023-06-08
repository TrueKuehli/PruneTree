import React from 'react'

export default () => {
  return (
    <div>
      <h2>Some Big Numbers</h2>
      <p>Looks like our user have been busy creating trees so I thought I would share some stats so you can see just how busy you've been.</p>
      <table className='table' style={{ maxWidth: 500, margin: '20px auto' }}>
        <tbody>
          <tr>
            <th>Users Signed Up</th>
            <td>220,000+</td>
          </tr>
          <tr>
            <th>Trees Created</th>
            <td>500,000+</td>
          </tr>
          <tr>
            <th>Trees Published</th>
            <td>70,000+</td>
          </tr>
          <tr>
            <th>Images Uploaded</th>
            <td>8,000,000+<br />(1.8 terabytes)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
