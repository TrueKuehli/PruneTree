import {PercentCrop} from 'react-image-crop';

import {LifeState} from './lifeStates';
import {Aspiration} from './aspirations';
import {Trait} from './traits';
import {CONCEPTION_TYPES, ConceptionType} from './conceptionTypes';
import {PartnerType} from './partnerType';


type Image = {
  _id?: IDBValidKey,
  original: Blob | File,
  cropped: Blob | File,
  cropData: PercentCrop,
}

type PersonLink = {
  title: string,
  treeId: number,
  personId: number,
}

type PersonCustomData = {
  title: string,
  value: string,
}

type Person = {
  _id?: IDBValidKey,
  treeId: number,

  firstName: string,
  lastName: string,
  avatar: number,
  bio: string,

  lifeStates: LifeState[],
  aspirations: Aspiration[],
  traits: Trait[],

  links: PersonLink[],
  custom: PersonCustomData[],
}

type PartnerData = {
  type: PartnerType,
  people: Person[],
}

type TreePersonNode = {
  parents: Person[],
  parentType: ConceptionType,
  adoptiveParents: Person[],
  partners: PartnerData[],
  person: Person,
  children: TreePersonNode[],
}

type Tree = {
  _id?: IDBValidKey,
  title: string,
  cover: number,
  description: string,

  data: TreePersonNode,
}


/**
 * Helper object to create default values for types
 */
const DEFAULTS = {
  get IMAGE(): Image {
    return {
      original: null,
      cropped: null,
      cropData: {
        unit: '%',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    };
  },

  get PERSON(): Person {
    return {
      treeId: -1,
      firstName: '',
      lastName: '',
      avatar: null,
      bio: '',

      traits: [],
      aspirations: [],
      lifeStates: [],

      custom: [],
      links: [],
    };
  },

  get TREE_PERSON_NODE(): TreePersonNode {
    return {
      parents: [],
      parentType: CONCEPTION_TYPES[0],
      adoptiveParents: [],
      partners: [],
      person: null,
      children: [],
    };
  },

  get TREE(): Tree {
    return {
      title: 'New Tree',
      description: '',
      cover: null,
      data: {
        parents: [],
        parentType: null,
        adoptiveParents: [],
        partners: [],
        person: null,
        children: [],
      },
    };
  },
};


export {
  Image,
  PersonLink,
  PersonCustomData,
  Person,
  PartnerData,
  TreePersonNode,
  Tree,

  DEFAULTS,
};
