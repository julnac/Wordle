-- CreateTable
CREATE TABLE "GameHistory" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "wordLength" INTEGER NOT NULL,
    "attempts" JSONB NOT NULL,
    "attemptsAllowed" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "level" TEXT,
    "language" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
