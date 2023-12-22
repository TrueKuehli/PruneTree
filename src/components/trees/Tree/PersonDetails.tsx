import React, {CSSProperties, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {CONCEPTION_TYPES, ConceptionType} from '../../../common/scripts/conceptionTypes';
import {getImageUri, ImageURL} from '../../../common/scripts/dataUrl';
import RawHTML from '../../RawHTML';
import ParentDetails from './ParentDetails';

import styles from './styles.scss';
import defaultAvatar from '../../../common/images/default-avatar.png';
import {Trait} from '../../../common/scripts/traits';
import {Aspiration} from '../../../common/scripts/aspirations';
import {LifeState} from '../../../common/scripts/lifeStates';
import {Person, PersonCustomData} from '../../../common/scripts/types';


type Props = {
  personId: number,
  treeId: number,
  traits?: Trait[],
  aspirations?: Aspiration[],
  lifeStates?: LifeState[],
  parentType?: ConceptionType,
  parents?: Person[],
  adoptiveParents?: Person[],
  custom?: PersonCustomData[],
  avatar?: number,
  style?: CSSProperties,
  closeDetails: () => void,
  firstName: string,
  lastName: string,
  bio: string,
  readonly?: boolean,
}


/**
 * The PersonDetails component renders the details of a person.
 * @param personId The ID of the person.
 * @param treeId The ID of the current tree.
 * @param traits The traits of the Sim.
 * @param aspirations The aspirations of the Sim.
 * @param lifeStates The life states of the Sim.
 * @param parentType The type of biological parent the Sim has.
 * @param parents The biological parents of the Sim.
 * @param adoptiveParents The adoptive parents of the Sim.
 * @param custom Custom key-value pairs of the Sim.
 * @param avatar The avatar image ID of the Sim.
 * @param style The style to apply to the component.
 * @param closeDetails The function to call to close the details.
 * @param firstName The first name of the Sim.
 * @param lastName The last name of the Sim.
 * @param bio The bio of the Sim.
 * @param readonly Whether the component is readonly.
 */
export default function PersonDetails({
  personId,
  treeId,
  traits = [],
  aspirations = [],
  lifeStates = [],
  parentType = CONCEPTION_TYPES[0],
  parents = [],
  adoptiveParents = [],
  custom = [],
  avatar,
  style,
  readonly,
  closeDetails,
  firstName,
  lastName,
  bio,
}: Props) {
  const [linkDataVisible, setLinkDataVisible] = useState(false);
  const [avatarURI, setAvatarURI] = useState<ImageURL>(null);

  useEffect(() => {
    if (avatar) {
      getImageUri(avatar).then((uri) => {
        setAvatarURI(uri);
      });
    }
  }, [avatar]);

  /**
   * Toggle the link data visibility.
   */
  function handleToggleLinkData() {
    setLinkDataVisible(!linkDataVisible);
  }

  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
  const backgroundImage = avatarURI ? `url(${avatarURI.url})` : `url(${defaultAvatar})`;
  const inlineAvatarStyle = {backgroundImage};

  return (
    <div className={styles.personDetails} style={style}>
      {!readonly && (
        <Link className={styles.editButton} to={`/trees/${treeId}/people/${personId}`}>
          <span>Edit</span>
        </Link>
      )}
      <div id='close-person-details' className={styles.closeButton} onClick={() => closeDetails()}>
        <span>Close</span>
      </div>
      <div className={styles.personDetailsTop}>
        <div className={styles.personDetailsAvatar} style={inlineAvatarStyle} />
        <h2 id='person-details-name'>{name}</h2>
      </div>
      <div>
        <RawHTML html={bio} />
      </div>

      {parents.length > 0 && (
        <div>
          <h3 id='person-details-biological-parents-title'>Biological Parents <ParentType type={parentType} /></h3>
          <div>
            {parents.map((parent, index) => <ParentDetails key={index}
                                                           avatar={parent.avatar}
                                                           firstName={parent.firstName}
                                                           lastName={parent.lastName} />)}
          </div>
        </div>
      )}

      {adoptiveParents.length > 0 && (
        <div>
          <h3>Adoptive Parents</h3>
          <div>
            {adoptiveParents.map((parent, index) => <ParentDetails key={index}
                                                                   avatar={parent.avatar}
                                                                   firstName={parent.firstName}
                                                                   lastName={parent.lastName} />)}
          </div>
        </div>
      )}

      {traits.length > 0 && (
        <div>
          <h3>Traits</h3>
          <div>
            {traits.map((trait, index) => {
              return <span className={styles.tag} key={index}>{trait}</span>;
            })}
          </div>
        </div>
      )}

      {aspirations.length > 0 && (
        <div>
          <h3>Aspirations</h3>
          <div>
            {aspirations.map((aspiration, index) => {
              return <span className={styles.tag} key={index}>{aspiration}</span>;
            })}
          </div>
        </div>
      )}

      {lifeStates.length > 0 && (
        <div>
          <h3>Life States</h3>

          {lifeStates.map((lifeState, index) => {
            return <span className={styles.tag} key={index}>{lifeState}</span>;
          })}
        </div>
      )}

      {custom.length > 0 && (
        <div>
          <h3>More</h3>

          <table className='table'>
            <tbody>
              {custom.map((item, index) => {
                return (
                  <tr key={index}>
                    <th scope='row'>{item.title || '<no title>'}</th>
                    <td>{item.value || '<no value>'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.linkDetailsToggle} onClick={handleToggleLinkData}>
        {linkDataVisible ? 'Hide Link Details' : 'Show Link Details'}
      </div>
      {linkDataVisible && (
        <div className={styles.linkDetails}>
          <div>Tree Id <code>{treeId}</code></div>
          <div>Person Id <code>{personId}</code></div>
        </div>
      )}
    </div>
  );
}


type ParentTypeProps = {
  type: ConceptionType,
}

const ParentType = ({type}: ParentTypeProps) => {
  if (type === 'Cloning') {
    return (<span className='label label-blue'>Clone</span>);
  } else if (type === 'Alien Abduction') {
    return (<span className='label label-green'>Alien&nbsp;Abduction</span>);
  } else {
    return null;
  }
};
