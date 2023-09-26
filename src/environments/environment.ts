// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {

  production: false,
  appDomain: 'http://localhost:4000',
  // appDomain: 'http://192.168.25.128:8080',
  // appDomain: 'http://192.168.1.105',
  // asURi: 'http://192.168.1.105:4260',
  asURi: 'http://192.168.1.105:4040',
  rsURi: 'http://192.168.1.105:4040',

  /* reCaptcha */
  siteKey: 'xxxxxxxxxxx',

};
