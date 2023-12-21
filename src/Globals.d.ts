declare module '*.jpg' {
  const path: string;
  export default path;
}

declare module '*.png' {
  const path: string;
  export default path;
}

declare module '*.gif' {
  const path: string;
  export default path;
}

declare module '*.svg' {
  const path: string;
  export default path;
}

declare module '*.css';
declare module '*.scss';

declare const PACKAGE_VERSION: string;
declare const COMMIT_HASH: string;
declare const BUILD_DATE: string;
