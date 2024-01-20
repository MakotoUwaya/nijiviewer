import { GoogleAnalytics } from "@next/third-parties/google";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAnalytics gaId="G-KH3DDQCG6B" />
      <Component {...pageProps} />
    </>
  );
};

export default App;