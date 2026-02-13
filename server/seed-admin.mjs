import "dotenv/config";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function seedAdmin() {
  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    // Admin credentials
    const userId = "Hobart";
    const password = "15001500";
    const displayName = "Admin";
    const name = "Khalid Abdullah";
    const email = "hobarti@protonmail.com";
    const phone = "+966504466528";
    const openId = `local_${userId}`;

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if user already exists
    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE userId = ? OR openId = ?",
      [userId, openId]
    );

    if (existing.length > 0) {
      // Update existing user
      await connection.execute(
        `UPDATE users SET 
          passwordHash = ?, displayName = ?, name = ?, email = ?, phone = ?, 
          role = 'admin', loginMethod = 'local', isVerified = 1
        WHERE userId = ? OR openId = ?`,
        [passwordHash, displayName, name, email, phone, userId, openId]
      );
      console.log(`✅ Admin user "${userId}" updated successfully`);
    } else {
      // Insert new user
      await connection.execute(
        `INSERT INTO users (openId, userId, passwordHash, displayName, name, email, phone, role, loginMethod, isVerified) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'admin', 'local', 1)`,
        [openId, userId, passwordHash, displayName, name, email, phone]
      );
      console.log(`✅ Admin user "${userId}" created successfully`);
    }

    console.log(`
    ═══════════════════════════════════════
    Admin Account Details:
    ───────────────────────────────────────
    User ID:      ${userId}
    Password:     ${password}
    Display Name: ${displayName}
    Name:         ${name}
    Email:        ${email}
    Phone:        ${phone}
    Role:         admin
    ═══════════════════════════════════════
    `);
  } catch (error) {
    console.error("❌ Failed to seed admin:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAdmin();
