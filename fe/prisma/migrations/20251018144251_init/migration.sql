-- CreateTable
CREATE TABLE "DeactivatedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deactivatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeactivatedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeactivatedUser_userId_key" ON "DeactivatedUser"("userId");

-- CreateIndex
CREATE INDEX "DeactivatedUser_userId_idx" ON "DeactivatedUser"("userId");

-- AddForeignKey
ALTER TABLE "DeactivatedUser" ADD CONSTRAINT "DeactivatedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
