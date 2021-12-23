module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { chrome: "90", safari: "14", firefox: "90" }, modules: false }],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["babel-plugin-styled-components", { pure: true }],
  ],
};
