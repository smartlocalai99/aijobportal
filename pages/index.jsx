import Head from "next/head";
import ModeSelectionScreen from "@/components/ModeSelectionScreen";

export default function Home() {
  return (
    <>
      <Head>
        <title>AIJobHero — Choose Your Experience</title>
        <meta name="description" content="Choose between the gamified career adventure or the classic website experience." />
      </Head>
      <ModeSelectionScreen />
    </>
  );
}
