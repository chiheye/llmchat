/*
  Warnings:

  - You are about to drop the column `chunkOverlap` on the `KnowledgeBase` table. All the data in the column will be lost.
  - You are about to drop the column `chunkSize` on the `KnowledgeBase` table. All the data in the column will be lost.
  - You are about to drop the column `embeddingModel` on the `KnowledgeBase` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `KnowledgeBase` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `KnowledgeBase` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `KnowledgeBase` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentChunk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModelParameter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `KnowledgeBase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_knowledgeBaseId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_modelId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_knowledgeBaseId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentChunk" DROP CONSTRAINT "DocumentChunk_documentId_fkey";

-- DropForeignKey
ALTER TABLE "KnowledgeBase" DROP CONSTRAINT "KnowledgeBase_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "KnowledgeBase" DROP CONSTRAINT "KnowledgeBase_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ModelParameter" DROP CONSTRAINT "ModelParameter_modelId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "KnowledgeBase" DROP COLUMN "chunkOverlap",
DROP COLUMN "chunkSize",
DROP COLUMN "embeddingModel",
DROP COLUMN "isPublic",
DROP COLUMN "ownerId",
DROP COLUMN "teamId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "DocumentChunk";

-- DropTable
DROP TABLE "Model";

-- DropTable
DROP TABLE "ModelParameter";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamMember";
