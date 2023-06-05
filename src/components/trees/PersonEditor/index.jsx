import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'
import Select from 'react-select/creatable'

import ImageManager from '../ImageManager'
import Loading from '../../Loading'
import RichEditor from '../../RichEditor'
import auth from '../../../common/js/auth'
import traitOptions from '../../../common/js/traits'
import aspirationOptions from '../../../common/js/aspirations'
import lifeStateOptions from '../../../common/js/lifeStates'
import styles from './styles.scss'
import defaultAvatar from '../../../common/images/default-avatar.png'
import { getOrigUploadedImageUri, getUploadedImageUri } from '../../../common/js/utils'

export default () => {
  const navigate = useNavigate()
  const params = useParams()
  const { treeId, personId } = params
  const [avatar, setAvatar] = useState(null)
  const [avatarUri, setAvatarUri] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [traits, setTraits] = useState([])
  const [aspirations, setAspirations] = useState([])
  const [lifeStates, setLifeStates] = useState([])
  const [custom, setCustom] = useState([])
  const [loading, setLoading] = useState(Boolean(personId))

  useEffect(() => {
    const authToken = auth.getToken()
    if (!authToken) {
      setLoading(false)
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    if (personId) {
      axios.get(`/api/people/${personId}`, { headers: { Authorization: `Bearer ${authToken}` } })
        .then((response) => {
          const { avatar, firstName, lastName, bio, traits, aspirations, lifeStates, custom } = response.data
          setAvatar(avatar)
          setAvatarUri(getUploadedImageUri(avatar, '200x200'))
          setFirstName(firstName)
          setLastName(lastName)
          setBio(bio)
          setTraits(traits)
          setAspirations(aspirations)
          setLifeStates(lifeStates)
          setCustom(custom)
          setLoading(false)
        })
        .catch((error) => {
          if (auth.loginRequired(error, navigate)) {
            return
          }
          setLoading(false)
          toast.error('Failed to get person info', { autoClose: false })
        })
    }
  }, [])

  function updateAvatar (image) {
    setAvatarUri(getOrigUploadedImageUri(image))
    setAvatar(image)
  }

  /**
   * Saves/updates the persons detail from what is currently in the state
   */
  function handleSubmit (event) {
    event.preventDefault()

    const authToken = auth.getToken()
    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    const person = {
      tree: treeId,
      avatar,
      firstName,
      lastName,
      bio,
      traits,
      aspirations,
      lifeStates,
      custom
    }

    if (personId) {
      _updatePerson(person)
    } else {
      _createPerson(person)
    }
  }

  function _createPerson (person) {
    const authToken = auth.getToken()

    axios.post('/api/people',
      person,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Person created')
        navigate(`/trees/${treeId}/people`)
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred creating person'), { autoClose: false })
      })
  }

  function _updatePerson (person) {
    const authToken = auth.getToken()

    axios.put(`/api/people/${personId}`,
      person,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Person updated')
        navigate(-1)
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred updating person'), { autoClose: false })
      })
  }

  function handleAddCustomRow (event) {
    event.preventDefault()
    setCustom([...custom, { title: '', value: '' }])
  }

  function handleRemoveCustomRow (event) {
    event.preventDefault()

    const indexToDelete = parseInt(event.target.dataset.index)
    const newCustom = custom.filter((item, index) => index !== indexToDelete)

    setCustom(newCustom)
  }

  function handleCustomFieldChange (event) {
    const index = parseInt(event.target.dataset.index)
    const { name, value } = event.target

    const updated = {}
    updated[name] = value

    const newCustom = custom.map((c, i) => {
      if (index !== i) {
        // This isn't the item we care about - keep it as-is
        return c
      }

      return {
        ...c,
        ...updated
      }
    })

    setCustom(newCustom)
  }

  if (loading) {
    return (<Loading message='Loading person editor' />)
  }

  let imagePreview
  if (avatar) {
    const style = { backgroundImage: `url(${avatarUri})` }
    imagePreview = (<div className={styles.personAvatarImage} style={style} />)
  } else {
    const style = { backgroundImage: `url(${defaultAvatar})` }
    imagePreview = (<div className={styles.personAvatarImage} style={style} />)
  }

  return (
    <div className='container'>
      <h1>{personId ? 'Edit Person' : 'Create Person'}</h1>
      <ImageManager
        aspect={1}
        image={avatar}
        imagePreview={imagePreview}
        dir='avatar'
        onImageChange={updateAvatar}
      />

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>First Name</label>
          <input id='first-name' className='form-control' type='text' name='firstName' value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
        </div>

        <div className='form-group'>
          <label>Last Name</label>
          <input id='last-name' className='form-control' type='text' name='lastName' value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
        </div>

        <RichEditor initialHtml={bio} onUpdate={setBio} />

        <div className='form-group'>
          <label>Traits</label>
          <PlumTreeMultiSelect
            options={traitOptions}
            onValuesChange={(values) => setTraits(values.map(v => v.value))}
            defaultValues={traits}
          />
        </div>

        <div className='form-group'>
          <label>Aspirations</label>
          <PlumTreeMultiSelect
            options={aspirationOptions}
            onValuesChange={(values) => setAspirations(values.map(v => v.value))}
            defaultValues={aspirations}
          />
        </div>

        <div className='form-group'>
          <label>Life States</label>
          <PlumTreeMultiSelect
            options={lifeStateOptions}
            onValuesChange={(values) => setLifeStates(values.map(v => v.value))}
            defaultValues={lifeStates}
          />
        </div>

        <div className='form-group'>
          <label>More (Custom)</label>
          <button className='btn btn-primary' onClick={handleAddCustomRow}><i className='icon-plus' /> Add More Custom Info</button>

          {custom.map((c, i) => {
            return (
              <div className={styles.customInfo} key={i}>
                <input
                  data-index={i}
                  className='form-control'
                  name='title'
                  type='text'
                  placeholder='Title'
                  value={c.title}
                  onChange={handleCustomFieldChange}
                />
                <input
                  data-index={i}
                  className='form-control'
                  name='value'
                  type='text'
                  placeholder='Value'
                  value={c.value}
                  onChange={handleCustomFieldChange}
                />
                <button
                  data-index={i}
                  className='btn btn-danger'
                  onClick={handleRemoveCustomRow}
                ><i className='icon-trash' />
                </button>
              </div>
            )
          })}
        </div>

        <Link className='btn btn-default' to={`/trees/${treeId}/people`}>Cancel</Link>
        <button id='save-person' type='submit' className='btn btn-primary'>{personId ? 'Update Person' : 'Create Person'}</button>
      </form>
    </div>
  )
}

const PlumTreeMultiSelect = ({ options, onValuesChange, defaultValues }) => {
  const customStyles = {
    multiValue: (provided, state) => {
      return {
        ...provided,
        ...{
          background: '#3498db',
          borderRadius: 3,
          boxShadow: '0 2px 3px 0 rgba(0,0,0,.075)'
        }
      }
    },
    multiValueLabel: (provided, state) => {
      return {
        ...provided,
        ...{
          color: '#fff',
          padding: '3px 10px',
          textShadow: '0 1px 2px rgba(0,0,0,.2)',
          fontSize: 16,
          fontWeight: 300
        }
      }
    },
    multiValueRemove: (provided, state) => {
      return {
        ...provided,
        ...{
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,.2)',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: '#2980b9',
            color: '#fff'
          }
        }
      }
    },
    control: (provided, state) => {
      return {
        ...provided,
        ...{
          borderColor: '#ccc',
          ':hover': {
            borderColor: 'rgba(26, 188, 156, 1)'
          }
        }
      }
    }
  }

  const optionObjects = options.map(value => { return { label: value, value } })
  const defaultValueObjects = defaultValues.map(value => { return { label: value, value } })

  return (
    <Select
      value={defaultValueObjects}
      onChange={onValuesChange}
      options={optionObjects}
      isMulti
      isSearchable
      styles={customStyles}
    />
  )
}
