import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const districts = [
  // ─── الرياض / Riyadh ─────────────────────────────────────────────
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Olaya", nameAr: "العليا", latitude: "24.6936", longitude: "46.6853" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Nakheel", nameAr: "النخيل", latitude: "24.7673", longitude: "46.6523" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Malqa", nameAr: "الملقا", latitude: "24.8071", longitude: "46.6253" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Yasmin", nameAr: "الياسمين", latitude: "24.8256", longitude: "46.6378" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Sahafah", nameAr: "الصحافة", latitude: "24.7963", longitude: "46.6628" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Narjis", nameAr: "النرجس", latitude: "24.8428", longitude: "46.6428" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Aqiq", nameAr: "العقيق", latitude: "24.7756", longitude: "46.6356" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Rawdah", nameAr: "الروضة", latitude: "24.7128", longitude: "46.7328" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Murabba", nameAr: "المربع", latitude: "24.6528", longitude: "46.7128" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Wizarat", nameAr: "الوزارات", latitude: "24.6628", longitude: "46.7028" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Malaz", nameAr: "الملز", latitude: "24.6728", longitude: "46.7228" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Sulimaniyah", nameAr: "السليمانية", latitude: "24.6928", longitude: "46.6928" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Worood", nameAr: "الورود", latitude: "24.7028", longitude: "46.6828" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Rahmaniyah", nameAr: "الرحمانية", latitude: "24.7328", longitude: "46.6528" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Ghadir", nameAr: "الغدير", latitude: "24.7528", longitude: "46.6728" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Hamra", nameAr: "الحمراء", latitude: "24.6828", longitude: "46.7428" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Shuhada", nameAr: "الشهداء", latitude: "24.6428", longitude: "46.7528" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Batha", nameAr: "البطحاء", latitude: "24.6328", longitude: "46.7128" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Naseem", nameAr: "النسيم", latitude: "24.6728", longitude: "46.7728" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Aziziyah", nameAr: "العزيزية", latitude: "24.6128", longitude: "46.7928" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Khaleej", nameAr: "الخليج", latitude: "24.6928", longitude: "46.7528" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "KAFD", nameAr: "كافد", latitude: "24.7648", longitude: "46.6448" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Takhassusi", nameAr: "التخصصي", latitude: "24.7148", longitude: "46.6648" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Rabwah", nameAr: "الربوة", latitude: "24.6528", longitude: "46.7328" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Muruj", nameAr: "المروج", latitude: "24.7428", longitude: "46.6428" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Qirawan", nameAr: "القيروان", latitude: "24.8628", longitude: "46.6128" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Hittin", nameAr: "حطين", latitude: "24.7828", longitude: "46.6128" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Raid", nameAr: "الرائد", latitude: "24.7228", longitude: "46.6428" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Tuwaiq", nameAr: "طويق", latitude: "24.6228", longitude: "46.6228" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Dar Al Baida", nameAr: "الدار البيضاء", latitude: "24.5928", longitude: "46.8128" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Arid", nameAr: "العارض", latitude: "24.8828", longitude: "46.6328" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Rimal", nameAr: "الرمال", latitude: "24.7028", longitude: "46.8128" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Irqah", nameAr: "عرقة", latitude: "24.7128", longitude: "46.5728" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Wadi", nameAr: "الوادي", latitude: "24.7528", longitude: "46.7028" },
  { city: "Riyadh", cityAr: "الرياض", nameEn: "Al Izdihar", nameAr: "الازدهار", latitude: "24.7428", longitude: "46.7128" },

  // ─── جدة / Jeddah ────────────────────────────────────────────────
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Corniche", nameAr: "الكورنيش", latitude: "21.5428", longitude: "39.1528" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Hamra", nameAr: "الحمراء", latitude: "21.5628", longitude: "39.1228" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Rawdah", nameAr: "الروضة", latitude: "21.5828", longitude: "39.1628" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Zahra", nameAr: "الزهراء", latitude: "21.5728", longitude: "39.1428" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Salamah", nameAr: "السلامة", latitude: "21.5928", longitude: "39.1328" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Andalus", nameAr: "الأندلس", latitude: "21.5328", longitude: "39.1728" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Shati", nameAr: "الشاطئ", latitude: "21.5528", longitude: "39.1028" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Marwah", nameAr: "المروة", latitude: "21.5128", longitude: "39.1928" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Safa", nameAr: "الصفا", latitude: "21.5228", longitude: "39.1828" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Faisaliyah", nameAr: "الفيصلية", latitude: "21.5028", longitude: "39.2028" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Nahdah", nameAr: "النهضة", latitude: "21.4928", longitude: "39.2128" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Khalidiyah", nameAr: "الخالدية", latitude: "21.5428", longitude: "39.1628" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Rehab", nameAr: "الرحاب", latitude: "21.5628", longitude: "39.1828" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Muhammadiyah", nameAr: "المحمدية", latitude: "21.5828", longitude: "39.1128" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Obhur Al Shamaliyah", nameAr: "أبحر الشمالية", latitude: "21.7228", longitude: "39.0928" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Obhur Al Janubiyah", nameAr: "أبحر الجنوبية", latitude: "21.6828", longitude: "39.1028" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Basateen", nameAr: "البساتين", latitude: "21.4828", longitude: "39.2228" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Nuzha", nameAr: "النزهة", latitude: "21.5928", longitude: "39.1528" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Bawadi", nameAr: "البوادي", latitude: "21.5728", longitude: "39.2028" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Ajwad", nameAr: "الأجواد", latitude: "21.4728", longitude: "39.2328" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Naseem", nameAr: "النسيم", latitude: "21.5028", longitude: "39.2228" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Aziziyah", nameAr: "العزيزية", latitude: "21.4628", longitude: "39.2428" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Hamdaniyah", nameAr: "الحمدانية", latitude: "21.4528", longitude: "39.2528" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Briman", nameAr: "بريمان", latitude: "21.5128", longitude: "39.2128" },
  { city: "Jeddah", cityAr: "جدة", nameEn: "Al Tilal", nameAr: "التلال", latitude: "21.6228", longitude: "39.1128" },

  // ─── المدينة المنورة / Madinah ────────────────────────────────────
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Haram", nameAr: "الحرم", latitude: "24.4672", longitude: "39.6112" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Aziziyah", nameAr: "العزيزية", latitude: "24.4472", longitude: "39.6312" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Khalidiyah", nameAr: "الخالدية", latitude: "24.4872", longitude: "39.5912" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Quba", nameAr: "قباء", latitude: "24.4372", longitude: "39.6212" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Uyun", nameAr: "العيون", latitude: "24.4572", longitude: "39.6412" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Rawdah", nameAr: "الروضة", latitude: "24.4772", longitude: "39.6012" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Iskan", nameAr: "الإسكان", latitude: "24.4172", longitude: "39.6512" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Salam", nameAr: "السلام", latitude: "24.4972", longitude: "39.5812" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Nakheel", nameAr: "النخيل", latitude: "24.5072", longitude: "39.5712" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Shuraybat", nameAr: "الشريبات", latitude: "24.4272", longitude: "39.6612" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Arid", nameAr: "العارض", latitude: "24.5172", longitude: "39.5612" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Uhud", nameAr: "أحد", latitude: "24.5072", longitude: "39.6112" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Jamiah", nameAr: "الجامعة", latitude: "24.4672", longitude: "39.5512" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Duwaimah", nameAr: "الدويمة", latitude: "24.4372", longitude: "39.5812" },
  { city: "Madinah", cityAr: "المدينة المنورة", nameEn: "Al Ranuna", nameAr: "الرانوناء", latitude: "24.4472", longitude: "39.5912" },

  // ─── مكة المكرمة / Makkah ────────────────────────────────────────
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Aziziyah", nameAr: "العزيزية", latitude: "21.3928", longitude: "39.8528" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Shisha", nameAr: "الششة", latitude: "21.4128", longitude: "39.8228" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Naseem", nameAr: "النسيم", latitude: "21.4028", longitude: "39.8328" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Rusayfah", nameAr: "الرصيفة", latitude: "21.3828", longitude: "39.8628" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Awali", nameAr: "العوالي", latitude: "21.3728", longitude: "39.8728" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Shoqiyah", nameAr: "الشوقية", latitude: "21.4228", longitude: "39.8128" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Zahra", nameAr: "الزاهر", latitude: "21.4328", longitude: "39.8028" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Kakiyah", nameAr: "الكاكية", latitude: "21.3628", longitude: "39.8828" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Jabal Al Nour", nameAr: "جبل النور", latitude: "21.4428", longitude: "39.8628" },
  { city: "Makkah", cityAr: "مكة المكرمة", nameEn: "Al Hamra", nameAr: "الحمراء", latitude: "21.4528", longitude: "39.7928" },

  // ─── الدمام / Dammam ──────────────────────────────────────────────
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Faisaliyah", nameAr: "الفيصلية", latitude: "26.4228", longitude: "50.0928" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Shati", nameAr: "الشاطئ", latitude: "26.4428", longitude: "50.1128" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Murjan", nameAr: "المرجان", latitude: "26.4628", longitude: "50.0728" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Nakheel", nameAr: "النخيل", latitude: "26.4028", longitude: "50.1028" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Rawdah", nameAr: "الروضة", latitude: "26.3828", longitude: "50.1228" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Mazruiyah", nameAr: "المزروعية", latitude: "26.3628", longitude: "50.1428" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Badiyah", nameAr: "البادية", latitude: "26.4828", longitude: "50.0528" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Anoud", nameAr: "العنود", latitude: "26.4128", longitude: "50.0828" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Jalawiyah", nameAr: "الجلوية", latitude: "26.3928", longitude: "50.1328" },
  { city: "Dammam", cityAr: "الدمام", nameEn: "Al Adamah", nameAr: "العدامة", latitude: "26.4328", longitude: "50.0628" },

  // ─── الخبر / Khobar ──────────────────────────────────────────────
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Aqrabiyah", nameAr: "العقربية", latitude: "26.2828", longitude: "50.2028" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Corniche", nameAr: "الكورنيش", latitude: "26.2628", longitude: "50.2228" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Rawabi", nameAr: "الروابي", latitude: "26.3028", longitude: "50.1828" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Thuqbah", nameAr: "الثقبة", latitude: "26.2928", longitude: "50.2128" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Bandariyah", nameAr: "البندرية", latitude: "26.2728", longitude: "50.2328" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Yarmouk", nameAr: "اليرموك", latitude: "26.3128", longitude: "50.1928" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Al Ulaya", nameAr: "العليا", latitude: "26.2528", longitude: "50.2428" },
  { city: "Khobar", cityAr: "الخبر", nameEn: "Half Moon Bay", nameAr: "نصف القمر", latitude: "26.2228", longitude: "50.2628" },

  // ─── تبوك / Tabuk ────────────────────────────────────────────────
  { city: "Tabuk", cityAr: "تبوك", nameEn: "Al Faisaliyah", nameAr: "الفيصلية", latitude: "28.3838", longitude: "36.5650" },
  { city: "Tabuk", cityAr: "تبوك", nameEn: "Al Muruj", nameAr: "المروج", latitude: "28.3938", longitude: "36.5550" },
  { city: "Tabuk", cityAr: "تبوك", nameEn: "Al Rawdah", nameAr: "الروضة", latitude: "28.3738", longitude: "36.5750" },
  { city: "Tabuk", cityAr: "تبوك", nameEn: "Al Nakheel", nameAr: "النخيل", latitude: "28.4038", longitude: "36.5450" },
  { city: "Tabuk", cityAr: "تبوك", nameEn: "Al Salam", nameAr: "السلام", latitude: "28.3638", longitude: "36.5850" },

  // ─── أبها / Abha ─────────────────────────────────────────────────
  { city: "Abha", cityAr: "أبها", nameEn: "Al Manhal", nameAr: "المنهل", latitude: "18.2228", longitude: "42.5028" },
  { city: "Abha", cityAr: "أبها", nameEn: "Al Nahdah", nameAr: "النهضة", latitude: "18.2328", longitude: "42.4928" },
  { city: "Abha", cityAr: "أبها", nameEn: "Al Rawdah", nameAr: "الروضة", latitude: "18.2128", longitude: "42.5128" },
  { city: "Abha", cityAr: "أبها", nameEn: "Al Shamsan", nameAr: "الشمسان", latitude: "18.2428", longitude: "42.4828" },
  { city: "Abha", cityAr: "أبها", nameEn: "Al Mahalah", nameAr: "المحالة", latitude: "18.2028", longitude: "42.5228" },
];

async function seed() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Check if districts already exist
  const [existing] = await conn.execute("SELECT COUNT(*) as cnt FROM districts");
  if (existing[0].cnt > 0) {
    console.log(`Districts table already has ${existing[0].cnt} records. Clearing and re-seeding...`);
    await conn.execute("DELETE FROM districts");
  }

  // Insert in batches
  const batchSize = 20;
  for (let i = 0; i < districts.length; i += batchSize) {
    const batch = districts.slice(i, i + batchSize);
    const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
    const values = batch.flatMap(d => [d.city, d.cityAr, d.nameEn, d.nameAr, d.latitude, d.longitude, 1]);
    await conn.execute(
      `INSERT INTO districts (city, cityAr, nameEn, nameAr, latitude, longitude, isActive) VALUES ${placeholders}`,
      values
    );
    console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} districts)`);
  }

  console.log(`\n✅ Seeded ${districts.length} districts across ${new Set(districts.map(d => d.city)).size} cities`);
  
  // Print summary
  const cities = {};
  districts.forEach(d => { cities[d.city] = (cities[d.city] || 0) + 1; });
  Object.entries(cities).forEach(([city, count]) => console.log(`   ${city}: ${count} districts`));

  await conn.end();
}

seed().catch(console.error);
