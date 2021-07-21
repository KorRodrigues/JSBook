import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle input entry file
      build.onResolve({ filter: /(^index\.js$)/ }, async () => ({
        path: 'index.js',
        namespace: 'a'
      }))

      // Handle relatives path in a module
      build.onResolve({ filter: /^\.+\//}, async (args: any) => ({ 
        path: new URL(args.path, 'https://unpkg.com'+ args.resolveDir +'/').href,
        namespace: 'a'
      }))

      // Handle main file in a module
      build.onResolve({ filter: /.*/ }, async (args: any) => ({
        path: `https://unpkg.com/${args.path}`,
        namespace: 'a'
      }));
    },
  };
};