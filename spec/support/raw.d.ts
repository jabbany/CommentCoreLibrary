/**
 * Fixtures imported as text through vite (e.g. '../fixtures/comment.xml?raw')
 */
declare module '*?raw' {
  const content:string;
  export default content;
}
