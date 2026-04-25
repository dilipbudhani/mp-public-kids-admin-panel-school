import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import SocialPost from "@/models/SocialPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const schoolId = getSchoolId(req);
        if (!schoolId) {
            return NextResponse.json({ message: "School ID is required" }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const platform = searchParams.get("platform")?.toUpperCase();

        if (!platform || !['INSTAGRAM', 'YOUTUBE', 'FACEBOOK'].includes(platform)) {
            return NextResponse.json({ message: "Valid platform (INSTAGRAM, YOUTUBE, FACEBOOK) is required" }, { status: 400 });
        }

        const settings = await SiteSettings.findById(schoolId);
        if (!settings) {
            return NextResponse.json({ message: "Site settings not found" }, { status: 404 });
        }

        let result;
        if (platform === 'INSTAGRAM') {
            result = await syncInstagram(schoolId, settings);
        } else if (platform === 'YOUTUBE') {
            result = await syncYouTube(schoolId, settings);
        } else if (platform === 'FACEBOOK') {
            result = await syncFacebook(schoolId, settings);
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("[SOCIAL_SYNC_ERROR]", error);
        return NextResponse.json({
            message: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

async function syncInstagram(schoolId: string, settings: any) {
    if (!settings.instagramAccessToken) {
        throw new Error("Instagram Access Token not configured");
    }

    const accessToken = settings.instagramAccessToken;
    const userId = settings.instagramUserId || 'me';
    const instagramUrl = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`;

    const response = await fetch(instagramUrl);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Instagram API Error: ${errorData.error?.message || "Unknown"}`);
    }

    const data = await response.json();
    const posts = data.data || [];

    const savedPosts = await Promise.all(posts.map(async (post: any) => {
        const postData = {
            platform: 'INSTAGRAM',
            postId: post.id,
            schoolId: schoolId,
            type: post.media_type,
            mediaUrl: post.media_url,
            permalink: post.permalink,
            caption: post.caption,
            timestamp: new Date(post.timestamp),
            thumbnailUrl: post.thumbnail_url || (post.media_type === 'IMAGE' ? post.media_url : null),
        };

        return await SocialPost.findOneAndUpdate(
            { platform: 'INSTAGRAM', postId: post.id, schoolId: schoolId },
            { $set: postData },
            { upsert: true, new: true }
        );
    }));

    return { message: "Instagram sync successful", count: savedPosts.length };
}

async function syncYouTube(schoolId: string, settings: any) {
    if (!settings.youtubeApiKey || !settings.youtubeChannelId) {
        throw new Error("YouTube API Key or Channel ID not configured");
    }

    const apiKey = settings.youtubeApiKey;
    const channelId = settings.youtubeChannelId;

    // 1. Get the 'uploads' playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();
    if (!channelRes.ok) {
        const ytError = channelData?.error?.message || channelData?.error?.errors?.[0]?.reason || "Unknown error";
        throw new Error(`YouTube API Error: ${ytError}`);
    }
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
        throw new Error("Could not find uploads playlist for this channel. Verify the Channel ID is correct.");
    }

    // 2. Fetch videos from the uploads playlist
    const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=10&key=${apiKey}`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();
    if (!videosRes.ok) {
        const ytError = videosData?.error?.message || "Unknown error";
        throw new Error(`YouTube API Error fetching videos: ${ytError}`);
    }
    const videos = videosData.items || [];

    const savedPosts = await Promise.all(videos.map(async (video: any) => {
        const snippet = video.snippet;
        const videoId = snippet.resourceId.videoId;

        const postData = {
            platform: 'YOUTUBE',
            postId: videoId,
            schoolId: schoolId,
            type: 'VIDEO',
            mediaUrl: `https://www.youtube.com/watch?v=${videoId}`,
            permalink: `https://www.youtube.com/watch?v=${videoId}`,
            caption: snippet.title,
            timestamp: new Date(snippet.publishedAt),
            thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        };

        return await SocialPost.findOneAndUpdate(
            { platform: 'YOUTUBE', postId: videoId, schoolId: schoolId },
            { $set: postData },
            { upsert: true, new: true }
        );
    }));

    return { message: "YouTube sync successful", count: savedPosts.length };
}

async function syncFacebook(schoolId: string, settings: any) {
    if (!settings.facebookAccessToken || !settings.facebookPageId) {
        throw new Error("Facebook Access Token or Page ID not configured");
    }

    const accessToken = settings.facebookAccessToken;
    const pageId = settings.facebookPageId;
    const facebookUrl = `https://graph.facebook.com/v19.0/${pageId}/feed?fields=id,message,created_time,full_picture,permalink_url&access_token=${accessToken}`;

    const response = await fetch(facebookUrl);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook API Error: ${errorData.error?.message || "Unknown"}`);
    }

    const data = await response.json();
    const posts = data.data || [];

    const savedPosts = await Promise.all(posts.map(async (post: any) => {
        // Skip posts without pictures or messages if desired, but here we save them
        if (!post.full_picture && !post.message) return null;

        const postData = {
            platform: 'FACEBOOK',
            postId: post.id,
            schoolId: schoolId,
            type: 'POST',
            mediaUrl: post.full_picture || '',
            permalink: post.permalink_url,
            caption: post.message,
            timestamp: new Date(post.created_time),
            thumbnailUrl: post.full_picture,
        };

        return await SocialPost.findOneAndUpdate(
            { platform: 'FACEBOOK', postId: post.id, schoolId: schoolId },
            { $set: postData },
            { upsert: true, new: true }
        );
    }));

    return {
        message: "Facebook sync successful",
        count: savedPosts.filter((p: any) => p !== null).length
    };
}
