/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require(`core-js/stable`)
require(`regenerator-runtime/runtime`)
require("dotenv").config()
const { join } = require(`path`)

const setPathOptions = (file) => {
  return join(__dirname, `options`, file)
}
module.exports = {
  verbose: true, // SEE: https://jestjs.io/docs/en/configuration.html#verbose-boolean
  rootDir: join(__dirname, `..`),
  roots: [`<rootDir>`],
  setupFilesAfterEnv: [setPathOptions(`setup-files/configure.js`)],
  testMatch: [`**/*.test.[jt]s`],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  moduleFileExtensions: [`ts`, `js`, `json`],
}
