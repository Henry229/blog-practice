"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { n8n } from "@/lib/n8n/client"

/**
 * Create a new blog post
 * @param title - Blog post title
 * @param content - Blog post content
 * @param publishImmediately - Whether to publish immediately (default: true)
 * @returns Object with success id or error message
 */
export async function createBlog(
  title: string,
  content: string,
  publishImmediately: boolean = true
) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a blog post" }
  }

  // Insert new blog post (초안 상태로 생성)
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title,
      content,
      author_id: user.id,
      status: "draft", // 초안으로 시작
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating blog:", error)
    return { error: error.message || "Failed to create blog post" }
  }

  // n8n 백엔드로 발행 요청 (publishImmediately가 true일 때만)
  if (publishImmediately) {
    const publishResult = await n8n.publishBlog({
      blog_id: data.id,
      title: data.title,
      content: data.content,
      author_id: user.id,
      publish_immediately: true,
      notify_subscribers: true, // 구독자 알림 기본값
      social_share: {
        twitter: false,
        facebook: false,
      },
    })

    // 캐시 갱신 (n8n 성공/실패 무관하게 항상 실행)
    revalidatePath("/")
    revalidatePath("/blog")

    if (!publishResult.success) {
      console.error("n8n publish failed:", publishResult.error)
      // n8n 실패해도 게시글은 생성됨 (초안 상태)
      return {
        id: data.id,
        warning: "게시글이 초안으로 저장되었습니다. n8n 후처리 작업이 실패했습니다.",
      }
    }

    // n8n 성공 시 추가 정보 반환
    return {
      id: data.id,
      published: true,
      notifications_sent: publishResult.data?.notifications?.email_sent || 0,
      seo_score: publishResult.data?.seo?.score || 0,
    }
  }

  // 즉시 발행하지 않는 경우 (초안으로 저장)
  revalidatePath("/")
  revalidatePath("/blog")
  return { id: data.id, published: false }
}

/**
 * Analyze blog content before publishing
 * @param title - Blog post title
 * @param content - Blog post content
 * @returns Analysis results with suggestions
 */
export async function analyzeBlogContent(title: string, content: string) {
  const result = await n8n.analyzeBlog({
    title,
    content,
    language: "ko",
    analysis_type: ["seo", "readability", "grammar", "sentiment"],
  })

  if (!result.success) {
    return { error: result.error?.message || "분석에 실패했습니다" }
  }

  return { analysis: result.data }
}

/**
 * Update an existing blog post
 * @param blogId - ID of the blog post to update
 * @param title - Updated title
 * @param content - Updated content
 * @returns Object with success status or error message
 */
export async function updateBlog(
  blogId: string,
  title: string,
  content: string
) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to update a blog post" }
  }

  // Update blog post (only if user is the author)
  const { error } = await supabase
    .from("blogs")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", blogId)
    .eq("author_id", user.id)

  if (error) {
    console.error("Error updating blog:", error)
    return { error: error.message || "Failed to update blog post" }
  }

  // Revalidate both the blog detail page and homepage
  revalidatePath(`/blog/${blogId}`)
  revalidatePath("/")
  revalidatePath("/blog")

  return { success: true }
}

/**
 * Delete a blog post
 * @param blogId - ID of the blog post to delete
 * @returns Object with success status or error message
 */
export async function deleteBlog(blogId: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to delete a blog post" }
  }

  // Delete blog post (only if user is the author)
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", blogId)
    .eq("author_id", user.id)

  if (error) {
    console.error("Error deleting blog:", error)
    return { error: error.message || "Failed to delete blog post" }
  }

  // Revalidate homepage and blog list
  revalidatePath("/")
  revalidatePath("/blog")

  return { success: true }
}
