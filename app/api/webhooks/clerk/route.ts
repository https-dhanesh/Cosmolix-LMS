import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent, createClerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error occured', { status: 400 });
  }

  const eventType = evt.type;

  // 2. Handle Creation and Updates
  if (eventType === 'user.created' || eventType === 'user.updated') {
    await connectDB();
    const { id, first_name, last_name, email_addresses, public_metadata } = evt.data;

    const role = (public_metadata?.role as string) || 'student';
    const tenantId = (public_metadata?.tenantId as string) || null;
    const domain = (public_metadata?.domain as string) || null;

    // Sync to MongoDB
    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        role: role,
        tenantId: tenantId, 
        domain: domain,    
        isActive: true,
        isDeleted: false
      },
      { upsert: true, new: true }
    );

    // 3. Metadata Re-Sync
    // If Clerk is missing any of the 3 pillars, we re-push them.
    // Notice: No parentheses () after clerkClient here.
    if (!public_metadata?.role || !public_metadata?.tenantId) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          role: role,
          tenantId: tenantId,
          domain: domain
        }
      });
    }
  }

  // 4. Handle Deletion
  if (eventType === 'user.deleted') {
    await connectDB();
    // Use the ID from evt.data.id directly
    await User.findOneAndDelete({ clerkId: evt.data.id });
  }

  return new Response('Sync Success', { status: 200 });
}