-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "SchoolRecommendationJob" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "preferredMajor" TEXT NOT NULL,
    "preferredLocation" TEXT,
    "schoolType" TEXT,
    "notes" TEXT,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB NOT NULL,
    "candidateSchools" JSONB,
    "promptResult" JSONB,
    "recommendation" TEXT,
    "evaluation" JSONB,
    "outputFilePath" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolRecommendationJob_pkey" PRIMARY KEY ("id")
);
