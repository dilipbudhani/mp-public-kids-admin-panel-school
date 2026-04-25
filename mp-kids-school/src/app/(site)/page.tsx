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
import SocialPost from "@/models/SocialPost";

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
  let aboutData: any = null;
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
      galleryData,
      socialData
    ] = await Promise.all([
      HeroSlide.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean(),
      Testimonial.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).limit(6).lean(),
      News.find({ isPublished: true, schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).limit(4).lean(),
      SchoolEvent.find({ isActive: true, schoolIds: process.env.SCHOOL_ID, date: { $gte: new Date() } }).sort({ date: 1 }).limit(5).lean(),
      Circular.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).limit(3).lean(),
      Stat.find({ schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).limit(4).lean(),
      StaticPage.findOne({ slug: 'about-overview', schoolIds: process.env.SCHOOL_ID }).lean(),
      Program.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean(),
      Facility.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean(),
      SiteSettings.findOne({ _id: process.env.SCHOOL_ID }).lean(),
      Gallery.find({ type: 'image', schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).limit(6).lean(),
      SocialPost.find({ schoolId: process.env.SCHOOL_ID }).sort({ timestamp: -1 }).limit(30).lean()
    ]);

    slides = slidesData.map(s => ({
      ...s,
      _id: s._id.toString(),
    })) as any;

    testimonials = testimonialsData.map(t => ({
      ...t,
      _id: t._id.toString(),
    })) as any;

    news = newsData.map(i => ({
      ...i,
      _id: i._id.toString(),
      image: (i as any).imageUrl || (i as any).image,
      publishedAt: i.date instanceof Date ? i.date.toISOString() : new Date().toISOString(),
    })) as any;

    events = eventsData.map(e => ({
      ...e,
      _id: e._id.toString(),
      date: e.date instanceof Date ? e.date.toISOString() : new Date().toISOString(),
    })) as any;

    notices = noticesData.map(n => ({
      ...n,
      id: n._id.toString(),
      _id: n._id.toString(),
      date: n.date instanceof Date ? n.date.toISOString() : new Date().toISOString(),
    })) as any;

    stats = statsData.map(st => ({
      ...st,
      _id: st._id.toString(),
    })) as any;

    programs = programsData.map(pr => ({
      ...pr,
      _id: pr._id.toString(),
    })) as any;

    facilities = facilitiesData.map(fa => ({
      ...fa,
      _id: fa._id.toString(),
    })) as any;

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
        ...s,
        _id: s._id.toString(),
        facebookUrl: s.facebookUrl,
        instagramUrl: s.instagramUrl,
        twitterUrl: s.twitterUrl,
        youtubeUrl: s.youtubeUrl,
      };
    }

    const socialPosts = socialData.map(p => ({
      id: p._id.toString(),
      platform: p.platform,
      image: p.mediaUrl,
      thumbnail: p.thumbnailUrl,
      caption: p.caption || "",
      type: p.type,
      permalink: p.permalink,
      likes: p.likes || 0,
      comments: p.comments || 0,
      date: p.timestamp
    }));

    if (socialPosts.length > 0) {
      galleryItems = socialPosts;
    } else {
      galleryItems = galleryData.map(g => ({
        id: g._id.toString(),
        _id: g._id.toString(),
        image: g.imageUrl,
        caption: g.title,
        likes: 0,
        comments: 0,
      })) as any;
    }

  } catch (error) {
    console.error("CRITICAL ERROR: Failed to fetch home data:", error);
  }

  return (
    <main className="flex flex-col">
      <Hero slides={slides} settings={settings} />
      <StatsBar stats={stats} />
      <AboutPreview data={aboutData} />
      <AcademicsGrid programs={programs} />
      <FacilitiesGrid facilities={facilities} />
      <HomeTestimonials testimonials={testimonials} />
      <HomeNews news={news} />
      <UpcomingEvents events={events} />
      <NoticeWidget notices={notices} />
      <SocialMediaSection settings={settings} galleryItems={galleryItems} />
    </main>
  );
}
