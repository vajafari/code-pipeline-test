module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 72],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "upper-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "ADDED", // new features
        "CHANGED", // changes in existing functionality
        "DEPRECATED", // soon-to-be removed features
        "REMOVED", // removed features
        "FIXED", // any bug fixes
        "SECURITY", // in case of vulnerabilities
        "WIP", // in case of work in progress
      ],
    ],
  },
}
