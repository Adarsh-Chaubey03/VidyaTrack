/**
 * Seed Script — Create the 4 Mentor/Educator Accounts
 *
 * These match the static mentor cards shown in the frontend (assets.js).
 * Running this script creates/updates all 4 accounts so:
 *   - Login at Educator Login page works
 *   - The /api/mentors/teachers endpoint returns them
 *   - Students can send mentorship requests to them
 *
 * Usage:
 *   node server/scripts/seedMentors.js
 *   npm run seed:mentors    ← if you add the npm script below
 *
 * Credentials (all share the same password):
 *   priya@gmail.com   / 123456789
 *   amit@gmail.com    / 123456789
 *   neha@gmail.com    / 123456789
 *   rahul@gmail.com   / 123456789
 *
 * Safe to re-run — uses upsert logic, never duplicates.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const PASSWORD = '123456789';

const MENTORS = [
  {
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=d1fae5&color=065f46&size=200',
  },
  {
    name: 'Amit Verma',
    email: 'amit@gmail.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Amit+Verma&background=dbeafe&color=1e40af&size=200',
  },
  {
    name: 'Neha Singh',
    email: 'neha@gmail.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Neha+Singh&background=fce7f3&color=9d174d&size=200',
  },
  {
    name: 'Rahul Desai',
    email: 'rahul@gmail.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Rahul+Desai&background=fef3c7&color=92400e&size=200',
  },
];

async function seedMentors() {
  if (!process.env.MONGODB_URI) {
    console.error('❌  MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB\n');

  for (const mentor of MENTORS) {
    const existing = await User.findOne({ email: mentor.email }).select('+password');

    if (existing) {
      // Ensure the account has educator role + approved, without touching unrelated fields
      let changed = false;

      if (existing.role !== 'educator')        { existing.role = 'educator';         changed = true; }
      if (!existing.educatorApproved)           { existing.educatorApproved = true;   changed = true; }
      if (existing.activeRole !== 'educator')   { existing.activeRole = 'educator';   changed = true; }
      if (existing.name !== mentor.name)        { existing.name = mentor.name;        changed = true; }

      if (changed) {
        await existing.save();
        console.log(`✏️   Updated   ${mentor.email}  (${mentor.name})`);
      } else {
        console.log(`✔️   Already ok  ${mentor.email}  (${mentor.name})`);
      }
    } else {
      // Create fresh — password is hashed by the User model pre-save hook
      const created = await User.create({
        name: mentor.name,
        email: mentor.email,
        password: PASSWORD,
        role: 'educator',
        activeRole: 'educator',
        educatorApproved: true,
        imageUrl: mentor.imageUrl,
      });
      console.log(`➕  Created    ${created.email}  (${created.name})  id: ${created._id}`);
    }
  }

  // Quick verify — password check for first account
  const check = await User.findOne({ email: MENTORS[0].email }).select('+password');
  const ok    = await check.comparePassword(PASSWORD);
  console.log(`\n🔒  Password hash check (${MENTORS[0].email}): ${ok ? 'PASSED ✓' : 'FAILED ✗'}`);
  if (!ok) {
    console.error('Password verification failed — check bcrypt rounds.');
    process.exit(1);
  }

  console.log('\n✅  All mentor accounts ready.');
  console.log('────────────────────────────────────────');
  MENTORS.forEach((m) => console.log(`  ${m.email}  /  ${PASSWORD}`));
  console.log('────────────────────────────────────────\n');

  await mongoose.disconnect();
}

seedMentors().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
