import {LifeState} from './lifeStates';
import {Aspiration} from './aspirations';
import {Trait} from './traits';
import {ConceptionType} from './conceptionTypes';


type ImagePercentCrop = {
  unit: '%',
  x: number,
  y: number,
  width: number,
  height: number,
}

type Image = {
  _id?: IDBValidKey,
  original: Blob | File,
  cropped: Blob | File,
  cropData: ImagePercentCrop,
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

type TreePersonNode = {
  parents: Person[],
  parentType: ConceptionType,
  adoptiveParents: Person[],
  partners: Person[],
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


const defaultImage: Image = {
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

const defaultPerson: Person = {
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

const defaultTree: Tree = {
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


export {
  ImagePercentCrop,
  Image,
  PersonLink,
  PersonCustomData,
  Person,
  TreePersonNode,
  Tree,

  defaultImage,
  defaultPerson,
  defaultTree,
};
