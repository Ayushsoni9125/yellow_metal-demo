-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('SUBMITTED');

-- CreateTable
CREATE TABLE "LoanPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interestRate" DECIMAL(65,30) NOT NULL,
    "maxLtv" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "grossWeightGrams" DECIMAL(65,30) NOT NULL,
    "netWeightGrams" DECIMAL(65,30) NOT NULL,
    "purityKarat" INTEGER NOT NULL,
    "pureGoldWeightGrams" DECIMAL(65,30) NOT NULL,
    "goldValue" DECIMAL(65,30) NOT NULL,
    "eligibleLoanAmount" DECIMAL(65,30) NOT NULL,
    "selectedPlanId" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_applicationId_key" ON "Lead"("applicationId");

-- CreateIndex
CREATE INDEX "Lead_mobileNumber_idx" ON "Lead"("mobileNumber");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_selectedPlanId_fkey" FOREIGN KEY ("selectedPlanId") REFERENCES "LoanPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
