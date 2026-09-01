import prisma from "../src/lib/prisma.js";

async function main() {
  await prisma.loanPlan.upsert({
    where: {
      id: "PLAN_BULLET_01",
    },
    update: {},
    create: {
      id: "PLAN_BULLET_01",
      name: "Bullet Repayment Plan",
      interestRate: 12,
      maxLtv: 75,
    },
  });

  await prisma.loanPlan.upsert({
    where: {
      id: "PLAN_EMI_01",
    },
    update: {},
    create: {
      id: "PLAN_EMI_01",
      name: "Monthly EMI Plan",
      interestRate: 14,
      maxLtv: 75,
    },
  });

  console.log("Loan plans seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });