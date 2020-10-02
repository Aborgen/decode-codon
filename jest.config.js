module.exports = {
  "moduleFileExtensions": [
    "js",
    "ts",
    "vue"
  ],
  "moduleNameMapper": {
    "^tests(.*)$": "<rootDir>/tests$1",
    "^src(.*)$": "<rootDir>/src$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^data(.*)$": "<rootDir>/src/data$1",
    "^types(.*)$": "<rootDir>/src/types$1"
  },
  "transform": {
    ".*\\.(js)$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(ts)$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  }
}
