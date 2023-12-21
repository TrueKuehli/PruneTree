import React from 'react';

import {
  NODE_PLUS_WIDTH,
  NODE_PLUS_HEIGHT,
  PARTNER_ABDUCTION_TOP_RADIUS,
  PARTNER_ABDUCTION_TOP_Y,
  PARTNER_ABDUCTION_BASE_Y,
  PARTNER_ABDUCTION_BASE_WIDTH,
  PARTNER_ABDUCTION_BASE_HEIGHT,
} from './constants';

import {PartnerType} from '../../../common/scripts/partnerTypes';

import styles from './styles.scss';


type Props = {
  type: PartnerType,
}


/**
 * Renders the partner type as a symbol.
 * @param type The type of partner.
 * @constructor
 */
export default function PartnerTypeSymbol({type}: Props) {
  if (type === 'Partner' || type === 'Ex-Partner') {
    let transform = 'translate(-5,35)';
    if (type === 'Ex-Partner') {
      transform += ' rotate(45,5,5)';
    }

    return (
      <g className={type === 'Ex-Partner' ? `${styles.plus} ex-partner-symbol` : `${styles.plus} partner-symbol`}
         transform={transform}>
        <line
          x1={NODE_PLUS_WIDTH / 2}
          y1='0'
          x2={NODE_PLUS_WIDTH / 2}
          y2={NODE_PLUS_HEIGHT}
        />
        <line
          x1='0'
          y1={NODE_PLUS_HEIGHT / 2}
          x2={NODE_PLUS_WIDTH}
          y2={NODE_PLUS_HEIGHT / 2}
        />
      </g>
    );
  }

  if (type === 'Abduction') {
    return (
      <g className={`${styles.abduction} abduction-symbol`} transform='translate(-5,35)'>
        <circle
          cx={PARTNER_ABDUCTION_BASE_WIDTH / 2}
          cy={PARTNER_ABDUCTION_TOP_Y}
          r={PARTNER_ABDUCTION_TOP_RADIUS}
        />
        <rect
          x='0'
          y={PARTNER_ABDUCTION_BASE_Y}
          ry={PARTNER_ABDUCTION_BASE_HEIGHT / 2}
          width={PARTNER_ABDUCTION_BASE_WIDTH}
          height={PARTNER_ABDUCTION_BASE_HEIGHT}
        />
      </g>
    );
  }

  if (type === 'Married') {
    return (
      <polyline
        transform='translate(-2,35)'
        className={`${styles.marriage} marriage-symbol`}
        points='0,10 0,3 3,6 6,3 6,10'
      />
    );
  }

  return null;
}
