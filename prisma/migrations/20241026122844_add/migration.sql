-- CreateEnum
CREATE TYPE "StatusAuthAttempts" AS ENUM ('SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "auth_attempts_log" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "message" TEXT NOT NULL,
    "status" "StatusAuthAttempts" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "auth_attempts_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auth_attempts_log" ADD CONSTRAINT "auth_attempts_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
