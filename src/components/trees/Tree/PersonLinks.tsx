import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {PersonLink} from '../../../common/scripts/types';
import {
  NODE_BUTTON_RADIUS,
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  NODE_AVATAR_RADIUS,
  LINK_BUTTON_PATTERN,
} from './constants';

import styles from './styles.scss';


type Props = {
  small?: boolean,
  links: PersonLink[],
}


/**
 * The PersonLinks component renders the links of a person.
 * @param small Whether to render the small version.
 * @param links The links to render.
 */
export default function PersonLinks({small, links}: Props) {
  const [linksOpen, setLinksOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggle the link details.
   */
  function handleToggleLinks() {
    setLinksOpen(!linksOpen);
  }

  /**
   * Callback to go to the linked tree.
   * @param treeId The ID of the tree.
   * @param personId The ID of the person to link to.
   */
  function goToTree(treeId: number, personId: number) {
    navigate({
      pathname: `/${treeId}`,
      search: `?p=${personId}`,
    });
  }

  // Icon position
  const offset = small ? NODE_SMALL_AVATAR_RADIUS : NODE_AVATAR_RADIUS;
  const centered = NODE_BUTTON_RADIUS + (NODE_HEIGHT - NODE_BUTTON_RADIUS * 2) / 2;

  // List position
  const linkListHeight = links.length * 48;
  const listX = centered + offset - NODE_BUTTON_RADIUS;
  const listY = centered - offset - NODE_BUTTON_RADIUS - linkListHeight - 10;

  return (
    <g className='person-link'>
      <circle
        className={`${styles.linksIcon} person-links`}
        cx={centered + offset}
        cy={centered - offset}
        fill={`url(#${LINK_BUTTON_PATTERN})`}
        r={NODE_BUTTON_RADIUS}
        onClick={handleToggleLinks}
      />

      {linksOpen && (
        <g transform={`translate(${listX},${listY})`}>
          <rect className={styles.linkList} width='198' height={linkListHeight} rx='3' ry='3' />

          {links.map((linkData, index) => {
            const {treeId, personId} = linkData;
            return (
              <g
                key={index}
                className={`${styles.linkListItem} person-link`}
                transform={`translate(0,${48 * index})`}
                onClick={() => goToTree(treeId, personId)}
              >
                <rect width='198' height='48' rx='3' ry='3' />
                <text className={styles.linkListText} transform='translate(10,30)'>{linkData.title || 'Unnamed Link'}</text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
