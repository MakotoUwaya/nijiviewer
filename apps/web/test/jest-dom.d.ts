import "@testing-library/jest-dom";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}
