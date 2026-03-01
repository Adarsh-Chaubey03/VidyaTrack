/**
 * Seed Script — Create Predefined Educator Account
 *
 * Usage:  npm run seed:educator
 *
 * This script:
 *  1. Connects to MongoDB using the same URI as the app.
 *  2. Checks if teacher@gmail.com already exists.
 *     - If yes, updates role + educatorApproved (does NOT overwrite password unless --force).
 *     - If no, creates the user with bcrypt-hashed password.
 *  3. Disconnects cleanly.
 *
 * Password is NEVER logged or stored in plain text in the database.
 * The bcrypt pre-save hook in the User model handles hashing automatically.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

// ─── Configuration ────────────────────────────────────────
const EDUCATOR_EMAIL    = 'teacher@gmail.com';
const EDUCATOR_PASSWORD = 'teacher@123';   // Only used once for initial hash
const EDUCATOR_NAME     = 'VidyaTrack Educator';
const EDUCATOR_ROLE     = 'educator';
// ──────────────────────────────────────────────────────────

const forceReset = process.argv.includes('--force');

async function seedEducator() {
  try {
    // 1. Validate environment
    if (!process.env.MONGODB_URI) {
      console.error('❌  MONGODB_URI is not set. Aborting.');
      process.exit(1);
    }
    if (!process.env.JWT_SECRET) {
      console.error('❌  JWT_SECRET is not set. Aborting.');
      process.exit(1);
    }

    // 2. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    // 3. Check if educator already exists
    const existing = await User.findOne({ email: EDUCATOR_EMAIL });

    if (existing) {
      console.log(`ℹ️   User ${EDUCATOR_EMAIL} already exists (id: ${existing._id})`);

      let updated = false;

      if (existing.role !== EDUCATOR_ROLE) {
        existing.role = EDUCATOR_ROLE;
        updated = true;
      }
      if (!existing.educatorApproved) {
        existing.educatorApproved = true;
        updated = true;
      }
      if (existing.activeRole !== EDUCATOR_ROLE) {
        existing.activeRole = EDUCATOR_ROLE;
        updated = true;
      }

      // Only reset password if --force flag is passed
      if (forceReset) {
        existing.password = EDUCATOR_PASSWORD; // pre-save hook will hash
        updated = true;
        console.log('🔑  Password reset to default (--force flag detected)');
      }

      if (updated) {
        await existing.save(); // triggers bcrypt hash if password changed
        console.log('✅  Educator account updated successfully');
      } else {
        console.log('✅  Educator account is already correctly configured');
      }
    } else {
      // 4. Create new educator — password hashed by pre-save hook (12 rounds bcrypt)
      const educator = await User.create({
        name: EDUCATOR_NAME,
        email: EDUCATOR_EMAIL,
        password: EDUCATOR_PASSWORD,
        role: EDUCATOR_ROLE,
        activeRole: EDUCATOR_ROLE,
        educatorApproved: true,
        imageUrl: 'https://via.placeholder.com/150',
      });

      console.log(`✅  Educator account created successfully`);
      console.log(`    ID    : ${educator._id}`);
      console.log(`    Email : ${educator.email}`);
      console.log(`    Role  : ${educator.role}`);
      console.log(`    Approved : ${educator.educatorApproved}`);
    }

    // 5. Verify the password hash is correct (sanity check)
    const verifyUser = await User.findOne({ email: EDUCATOR_EMAIL }).select('+password');
    const isValid = await verifyUser.comparePassword(EDUCATOR_PASSWORD);
    console.log(`🔒  Password hash verification: ${isValid ? 'PASSED ✓' : 'FAILED ✗'}`);

    if (!isValid) {
      console.error('❌  Password verification failed! The account may not work for login.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌  Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📦  Disconnected from MongoDB');
  }
}

seedEducator();
