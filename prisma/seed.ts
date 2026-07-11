import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Database ready. Katalog sekolah dummy disimpan di src/data/katalogSekolah.ts");
  console.log("Tabel utama assignment: SchoolRecommendationJob");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
