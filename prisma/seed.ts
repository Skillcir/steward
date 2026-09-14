import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.resource.createMany({
    data: [
      {
        name: "Conference Room A",
        description: "Projector, whiteboard, video conferencing.",
        location: "3rd floor",
        capacity: 8,
      },
      {
        name: "Focus Pod 1",
        description: "Quiet room for calls or deep work.",
        location: "2nd floor",
        capacity: 1,
      },
      {
        name: "Studio Camera Kit",
        description: "Mirrorless camera, tripod, lav mic.",
        location: "Equipment closet",
        capacity: 1,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
