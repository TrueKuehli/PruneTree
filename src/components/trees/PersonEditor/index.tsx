import React, {useState, useEffect, useRef} from 'react';
import {Link, useBeforeUnload, useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Select from 'react-select/creatable';

import {Person, PersonCustomData} from '../../../common/scripts/types';
import {Trait, TRAITS} from '../../../common/scripts/traits';
import {Aspiration, ASPIRATIONS} from '../../../common/scripts/aspirations';
import {LifeState, LIFE_STATES} from '../../../common/scripts/lifeStates';
import database from '../../../common/scripts/database';
import {getImageUri, ImageURL} from '../../../common/scripts/dataUrl';
import REACT_SELECT_CUSTOM_STYLES from '../utils';
import Loading from '../../Loading';
import ImageManager from '../ImageManager';
import RichEditor from '../../RichEditor';

import styles from './styles.scss';
import defaultAvatar from '../../../common/images/default-avatar.png';


/**
 * The PersonEditor component renders the editor for a person.
 */
export default function PersonEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const {treeId, personId} = params;

  const [avatar, setAvatar] = useState<number>(null);
  const [avatarUri, setAvatarUri] = useState<ImageURL>(null);
  const [orpahnedAvatars, setOrphanedAvatars] = useState<number[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [traits, setTraits] = useState<Trait[]>([]);
  const [aspirations, setAspirations] = useState<Aspiration[]>([]);
  const [lifeStates, setLifeStates] = useState<LifeState[]>([]);
  const [custom, setCustom] = useState<PersonCustomData[]>([]);
  const [loading, setLoading] = useState(!!personId);

  // Ref is available in cleanup, state is not
  const createdAvatars = useRef<number[]>([]);

  useEffect(() => {
    if (personId) {
      database.getPerson(personId)
        .then((response) => {
          const {
            avatar,
            firstName,
            lastName,
            bio,
            traits,
            aspirations,
            lifeStates,
            custom,
          } = response;
          setFirstName(firstName);
          setLastName(lastName);
          setBio(bio);
          setTraits(traits);
          setAspirations(aspirations);
          setLifeStates(lifeStates);
          setCustom(custom);
          if (avatar) {
            getImageUri(avatar).then((uri) => {
              setAvatar(avatar);
              setAvatarUri(uri);
              setLoading(false);
            });
          } else {
            setAvatar(null);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err?.message || 'Failed to get person info', {autoClose: false});
        });
    }
  }, [personId]);

  // Delete all created images when navigating away from the page
  useBeforeUnload(
    React.useCallback(() => {
      deleteCreatedImages();
    }, []),
  );

  // Delete all created images when unmounting the component
  useEffect(() => {
    return () => {
      deleteCreatedImages();
    };
  }, []);

  /**
   * Callback to update the current avatar.
   * @param imageId The image to set as the avatar.
   */
  function updateAvatar(imageId: number) {
    // Set previous avatar as orphaned, such that it can be deleted on submit
    if (avatar && !orpahnedAvatars.includes(avatar) && imageId !== avatar) {
      setOrphanedAvatars([...orpahnedAvatars, avatar]);
    }

    // Add new avatar to created avatars, such that it can be deleted on cancel
    if (imageId && !createdAvatars.current.includes(imageId) && imageId !== avatar) {
      createdAvatars.current = ([...createdAvatars.current, imageId]);
    }

    if (imageId === null) {
      setAvatar(null);
      setAvatarUri(null);
    } else {
      getImageUri(imageId).then((uri) => {
        setAvatarUri(uri);
        setAvatar(imageId);
      });
    }
  }

  /**
   * Deletes all created images on cancel.
   */
  function deleteCreatedImages() {
    if (createdAvatars.current.length) {
      database.deleteImages(createdAvatars.current)
        .catch((err) => {
          toast.error(err?.message || 'Failed to delete created images', {autoClose: false});
        });
    }
  }

  /**
   * Saves/updates the person details from the current state.
   * @param event The form submit event.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const person = {
      treeId: parseInt(treeId),
      avatar,
      firstName,
      lastName,
      bio,
      traits,
      aspirations,
      lifeStates,
      custom,
    };

    createdAvatars.current = []; // Clear created covers, as orphanedCovers handles cleanup

    if (personId) {
      _updatePerson(person);
    } else {
      _createPerson(person);
    }
  }

  /**
   * Creates a new person with the data provided.
   * @param person The data to create the person with
   */
  function _createPerson(person: Partial<Person>) {
    database.createPerson(person)
      .then(async () => {
        if (orpahnedAvatars.length) {
          await database.deleteImages(orpahnedAvatars);
        }

        toast.success('Person created');
        navigate(`/trees/${treeId}/people`);
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred creating person', {autoClose: false});
      });
  }

  /**
   * Updates an existing person with the data provided.
   * @param person
   */
  function _updatePerson(person: Partial<Person>) {
    database.updatePerson(personId, person)
      .then(async () => {
        if (orpahnedAvatars.length) {
          await database.deleteImages(orpahnedAvatars);
        }

        toast.success('Person updated');
        navigate(-1);
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred updating person', {autoClose: false});
      });
  }

  /**
   * Adds a new custom row to the custom data.
   * @param event The click event.
   */
  function handleAddCustomRow(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    setCustom([...custom, {title: '', value: ''}]);
  }

  /**
   * Removes a custom row from the custom data.
   * @param event The click event.
   */
  function handleRemoveCustomRow(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    const indexToDelete = parseInt((event.target as HTMLButtonElement).dataset.index);
    const newCustom = custom.filter(
      (_, index) => index !== indexToDelete,
    );

    setCustom(newCustom);
  }

  /**
   * Updates the custom data with the new value.
   * @param event The change event.
   */
  function handleCustomFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const index = parseInt(event.target.dataset.index);
    const {name, value} = event.target;

    const updated = {};
    updated[name] = value;

    const newCustom = custom.map((c, i) => {
      if (index !== i) {
        // This isn't the item we care about - keep it as-is
        return c;
      }

      return {
        ...c,
        ...updated,
      };
    });

    setCustom(newCustom);
  }

  const backgroundUrl = avatar ? avatarUri.url : defaultAvatar;
  const imagePreview =
    (<div className={styles.personAvatarImage} style={{backgroundImage: `url(${backgroundUrl})`}} />);

  return (
    loading ? <Loading message='Loading person editor' /> :

    <div className='container'>
      <h1>{personId ? 'Edit Person' : 'Create Person'}</h1>
      <ImageManager
        aspect={1}
        image={avatar}
        imagePreview={imagePreview}
        onImageChange={updateAvatar}
      />

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>First Name</label>
          <input id='first-name' className='form-control' type='text' name='firstName' value={firstName}
                 onChange={(ev) => setFirstName(ev.target.value)} />
        </div>

        <div className='form-group'>
          <label>Last Name</label>
          <input id='last-name' className='form-control' type='text' name='lastName' value={lastName}
                 onChange={(ev) => setLastName(ev.target.value)} />
        </div>

        <RichEditor initialHtml={bio} onUpdate={setBio} />

        <div className='form-group'>
          <label>Traits</label>
          <PruneTreeMultiSelect
            options={TRAITS}
            onValuesChange={(values: {label: string, value: string}[]) =>
              setTraits(values.map((v) => v.value as Trait))}
            defaultValues={traits}
          />
        </div>

        <div className='form-group'>
          <label>Aspirations</label>
          <PruneTreeMultiSelect
            options={ASPIRATIONS}
            onValuesChange={(values: {label: string, value: string}[]) =>
              setAspirations(values.map((v) => v.value as Aspiration))}
            defaultValues={aspirations}
          />
        </div>

        <div className='form-group'>
          <label>Life States</label>
          <PruneTreeMultiSelect
            options={LIFE_STATES}
            onValuesChange={(values: {label: string, value: string}[]) =>
              setLifeStates(values.map((v) => v.value as LifeState))}
            defaultValues={lifeStates}
          />
        </div>

        <div className='form-group'>
          <label>More (Custom)</label>
          <button className='btn btn-primary' onClick={handleAddCustomRow}><i className='icon-plus' />
            Add More Custom Info
          </button>

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
            );
          })}
        </div>

        <Link className='btn btn-default' to={`/trees/${treeId}/people`}>Cancel</Link>
        <button id='save-person' type='submit' className='btn btn-primary'>
          {personId ? 'Update Person' : 'Create Person'}
        </button>
      </form>
    </div>
  );
}


type MultiSelectProps = {
  options: Readonly<string[]>,
  onValuesChange: (values: {label: string, value: string}[]) => void,
  defaultValues: Readonly<string[]>,
}

/**
 * The PruneTreeMultiSelect component renders a multi-select component with the PruneTree theme.
 * @param options The options to render.
 * @param onValuesChange The function to call when the values change.
 * @param defaultValues The default values to set.
 */
function PruneTreeMultiSelect({options, onValuesChange, defaultValues}: MultiSelectProps) {
  const optionObjects = options.map((value) => {
    return {label: value, value};
  });
  const defaultValueObjects = defaultValues.map((value) => {
    return {label: value, value};
  });

  return (
    <Select
      value={defaultValueObjects}
      onChange={onValuesChange}
      options={optionObjects}
      isMulti
      isSearchable
      styles={REACT_SELECT_CUSTOM_STYLES}
    />
  );
}
