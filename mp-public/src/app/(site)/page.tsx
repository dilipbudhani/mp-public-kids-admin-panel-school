import Link from "next/link";
import { Hero } from "@/components/home/Hero";
export const dynamic = "force-dynamic";
import { StatsBar } from "@/components/home/StatsBar";
import { AboutPreview } from "@/components/home/AboutPreview";
import { AcademicsGrid } from "@/components/home/AcademicsGrid";
import FacilitiesGrid from '@/components/home/FacilitiesGrid';
import HomeTestimonials from '@/components/home/HomeTestimonials';
import UpcomingEvents from '@/components/UpcomingEvents';
import NoticeWidget from '@/components/NoticeWidget';
import HomeNews from '@/components/home/HomeNews';
import SocialMediaSection from '@/components/home/SocialMediaSection';
import { HomeInquiry } from "@/components/home/HomeInquiry";

import { dbConnect } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import Testimonial from "@/models/Testimonial";
import News from "@/models/News";
import SchoolEvent from "@/models/SchoolEvent";
import Circular from "@/models/Circular";
import Stat from "@/models/Stat";
import StaticPage from "@/models/StaticPage";
import Program from "@/models/Program";
import Facility from "@/models/Facility";
import SiteSettings from "@/models/SiteSettings";
import Gallery from "@/models/Gallery";

import {
  HeroSlide as IHeroSlide,
  Testimonial as ITestimonial,
  NewsItem as INewsItem,
  SchoolEvent as ISchoolEvent,
  Circular as ICircular,
  StatItem as IStatItem,
  Program as IProgram,
  Facility as IFacility,
  GalleryItem as IGalleryItem,
  SiteSettings as ISiteSettings
} from "@/types/shared";

export default async function Home() {
  let slides: IHeroSlide[] = [];
  let testimonials: ITestimonial[] = [];
  let news: INewsItem[] = [];
  let events: ISchoolEvent[] = [];
  let notices: ICircular[] = [];
  let stats: IStatItem[] = [];
  let programs: IProgram[] = [];
  let facilities: IFacility[] = [];
  let aboutData: any = null; // About data is still complex/dynamic
  let settings: ISiteSettings | null = null;
  let galleryItems: IGalleryItem[] = [];

  try {
    await dbConnect();

    const [
      slidesData,
      testimonialsData,
      newsData,
      eventsData,
      noticesData,
      statsData,
      aboutPageData,
      programsData,
      facilitiesData,
      settingsData,
      galleryData
    ] = await Promise.all([
      HeroSlide.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean(),
      Testimonial.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).limit(6).lean(),
      News.find({ isPublished: true, schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).limit(4).lean(),
      SchoolEvent.find({ isActive: true, schoolIds: process.env.SCHOOL_ID, date: { $gte: new Date() } }).sort({ date: 1 }).limit(5).lean(),
      Circular.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).limit(3).lean(),
      Stat.find({ schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).limit(4).lean(),
      StaticPage.findOne({ slug: 'about-us', schoolIds: process.env.SCHOOL_ID }).lean(),
      Program.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean(),
      Facility.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean(),
      SiteSettings.findOne({ _id: process.env.SCHOOL_ID, schoolIds: process.env.SCHOOL_ID }).lean(),
      Gallery.find({ type: 'image', schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).limit(6).lean()
    ]);

    // Map to plain objects and convert ObjectIds to strings
    slides = slidesData.map(slide => {
      const s = slide as any;
      return {
        _id: s._id.toString(),
        imageUrl: s.imageUrl,
        badge: s.badge,
        title: s.title,
        highlight: s.highlight,
        description: s.description,
        cta1Text: s.cta1Text,
        cta1Href: s.cta1Href,
        cta2Text: s.cta2Text,
        cta2Href: s.cta2Href,
        statValue: s.statValue || "",
        statLabel: s.statLabel || "",
      };
    }) as any;

    testimonials = testimonialsData.map(t => {
      const test = t as any;
      return {
        _id: test._id.toString(),
        name: test.name,
        role: test.role,
        content: test.content,
        rating: test.rating || 5,
        avatarUrl: test.avatarUrl,
      };
    }) as any;

    news = newsData.map(item => {
      const i = item as any;
      return {
        _id: i._id.toString(),
        title: i.title,
        slug: i.slug,
        image: i.imageUrl || i.image,
        summary: i.summary || i.excerpt || "",
        isFeatured: i.isFeatured || false,
        category: i.category || "News",
        publishedAt: i.date instanceof Date ? i.date.toISOString() : new Date().toISOString(),
      };
    }) as any;

    events = eventsData.map(event => {
      const e = event as any;
      return {
        _id: e._id.toString(),
        title: e.title,
        location: e.location || "School Campus",
        category: e.category || "General",
        type: e.type || e.category || "Event",
        date: e.date instanceof Date ? e.date.toISOString() : new Date().toISOString(),
      };
    }) as any;

    notices = noticesData.map(notice => {
      const n = notice as any;
      return {
        _id: n._id.toString(),
        id: n._id.toString(),
        title: n.title,
        category: n.category,
        description: n.description || "",
        fileUrl: n.fileUrl || n.pdfUrl || "",
        pdfUrl: n.fileUrl || n.pdfUrl || "",
        date: n.date instanceof Date ? n.date.toISOString() : new Date().toISOString(),
      };
    }) as any;

    stats = statsData.map(s => {
      const st = s as any;
      return {
        _id: st._id.toString(),
        label: st.label,
        value: st.value,
        suffix: st.suffix,
      };
    }) as any;

    programs = programsData.map(p => {
      const pr = p as any;
      return {
        _id: pr._id.toString(),
        title: pr.title,
        description: pr.description,
        icon: pr.icon,
        href: pr.href,
        color: pr.color,
      };
    }) as any;

    facilities = facilitiesData.map(f => {
      const fa = f as any;
      return {
        _id: fa._id.toString(),
        title: fa.title,
        description: fa.description,
        icon: fa.icon,
        image: fa.image,
      };
    }) as any;

    if (aboutPageData) {
      const ad = aboutPageData as any;
      aboutData = {
        _id: ad._id.toString(),
        title: ad.title,
        subtitle: ad.sections?.[0]?.title || "Our Legacy",
        content: ad.content || ad.sections?.[0]?.content,
        image: ad.sections?.[0]?.image || ad.bannerImage,
        features: ad.sections?.slice(1).map((s: any) => s.title).filter(Boolean)
      };
    }

    if (settingsData) {
      const s = settingsData as any;
      settings = {
        _id: s._id.toString(),
        schoolName: s.schoolName,
        contactEmail: s.contactEmail,
        contactPhone: s.contactPhone,
        address: s.address,
        facebookUrl: s.socialMedia?.facebook || s.facebookUrl,
        instagramUrl: s.socialMedia?.instagram || s.instagramUrl,
        twitterUrl: s.socialMedia?.twitter || s.twitterUrl,
        youtubeUrl: s.socialMedia?.youtube || s.youtubeUrl,
        admissionOpen: s.admissionOpen,
      };
    }

    galleryItems = galleryData.map(item => {
      const g = item as any;
      return {
        id: g._id.toString(),
        _id: g._id.toString(),
        image: g.imageUrl,
        caption: g.title,
        likes: Math.floor(Math.random() * 500) + 100, // Placeholder
        comments: Math.floor(Math.random() * 50) + 10,   // Placeholder
      };
    }) as any;

  } catch (error) {
    console.error("CRITICAL ERROR: Failed to fetch home data:", error);
  }

  return (
    <main className="flex flex-col">
      <Hero slides={slides} />
      <StatsBar stats={stats} />
      <AboutPreview data={aboutData} />
      <AcademicsGrid programs={programs} />
      <FacilitiesGrid facilities={facilities} />
      <HomeTestimonials testimonials={testimonials} />
      <HomeNews news={news} />
      <UpcomingEvents events={events} />
      <NoticeWidget notices={notices} />
      <SocialMediaSection settings={settings} galleryItems={galleryItems} />

      <HomeInquiry />
    </main>
  );
}
