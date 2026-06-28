import dynamic from "next/dynamic";
import Head from "next/head";
import Navbar from "@/components/Navbar";

const AIPortfolioHero = dynamic(() => import("@/components/AIPortfolioHero"), { ssr: false });
const CompanyLogoMarquee = dynamic(() => import("@/components/CompanyLogoMarquee"), { ssr: false });
const CareerFlow = dynamic(() => import("@/components/CareerFlow"), { ssr: false });
const FavoriteJobsSection = dynamic(() => import("@/components/FavoriteJobsSection"), { ssr: false });
const ClientTestimonials = dynamic(() => import("@/components/ClientTestimonials"), { ssr: false });
const StoriesNetwork = dynamic(() => import("@/components/StoriesNetwork"), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: false });
const JobFooterSection = dynamic(() => import("@/components/JobFooterSection"), { ssr: false });

export default function Classic() {
  return (
    <>
      <Head>
        <title>AIJobHero — Classic</title>
        <meta name="description" content="AI-powered career tools to help you get hired." />
      </Head>
      <Navbar />
      <div className="relative z-20 w-full">
        <AIPortfolioHero />
        <CompanyLogoMarquee />
        <CareerFlow />
        <FavoriteJobsSection />
        <ClientTestimonials />
        <StoriesNetwork />
        <TestimonialsSection />
        <JobFooterSection />
      </div>
    </>
  );
}
