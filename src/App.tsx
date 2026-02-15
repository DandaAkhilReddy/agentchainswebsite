import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import MarketplacePreview from './components/MarketplacePreview';
import FeaturesGrid from './components/FeaturesGrid';
import HowItWorks from './components/HowItWorks';
import CodeDemo from './components/CodeDemo';
import Architecture from './components/Architecture';
import MCPSpotlight from './components/MCPSpotlight';
import OpenClaw from './components/OpenClaw';
import DevExperience from './components/DevExperience';
import SocialProof from './components/SocialProof';
import Pricing from './components/Pricing';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

export default function App() {
  useScrollReveal();

  return (
    <>
      {/* Animated mesh gradient background */}
      <div className="mesh-gradient" aria-hidden="true" />

      {/* Navigation */}
      <Navbar />

      {/* Page sections — ordered per Supreme Judge page flow */}
      <main>
        <Hero />
        <Problem />
        <Solution />
        <MarketplacePreview />
        <FeaturesGrid />
        <HowItWorks />
        <CodeDemo />
        <Architecture />
        <MCPSpotlight />
        <OpenClaw />
        <DevExperience />
        <SocialProof />
        <Pricing />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}
