import {defineConfig} from 'astro/config';


// https://astro.build/config
export default defineConfig({
  base: '/',
  markdown: {
    syntaxHighlight: 'prism'
  },
  integrations: [],
  devToolbar: {
    enabled: false
  },
});
