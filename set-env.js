const fs = require("fs");
// targetPath should reflect where the .env file should go
const targetPath = "./src/environments/environment.prod.ts";
const envConfigFile = `
export const environment = {
  production: true,
  // name should match Netlify env key/keys
  supabaseURL: '${process.env.supabaseURL}',
  supabaseKey: '${process.env.supabaseKey}'
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
