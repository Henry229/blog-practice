"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Create a new blog post
 * @param title - Blog post title
 * @param content - Blog post content
 * @returns Object with success id or error message
 */
export async function createBlog(title: string, content: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a blog post" }
  }

  // Insert new blog post
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title,
      content,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating blog:", error)
    return { error: error.message || "Failed to create blog post" }
  }

  // Revalidate homepage to show new post
  revalidatePath("/")

  return { id: data.id }
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

  // Revalidate homepage
  revalidatePath("/")

  return { success: true }
}
