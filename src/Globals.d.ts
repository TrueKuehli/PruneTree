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

declare module '*.webp' {
  const path: string;
  export default path;
}

declare module '*.svg' {
  const path: string;
  export default path;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.css';
declare module '*.scss';

declare const PACKAGE_VERSION: string;
declare const COMMIT_HASH: string;
declare const BUILD_DATE: string;
declare const GIT_REPO_URL: string;
declare const CHANGELOG: string;
