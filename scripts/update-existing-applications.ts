// Run this script once to update existing job applications to have 'applied' status
import { db } from '../app/db';
import { jobApplications } from '../app/db/schema';
import { sql } from 'drizzle-orm';

async function updateExistingApplications() {
  try {
    console.log('Updating existing applications to have "applied" status...');

    const result = await db
      .update(jobApplications)
      .set({ status: 'applied' })
      .where(sql`${jobApplications.status} IS NULL OR ${jobApplications.status} = ''`)
      .returning();

    console.log(`Updated ${result.length} applications to "applied" status`);
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating applications:', error);
    process.exit(1);
  }
}

updateExistingApplications();
