import { Button } from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogInIcon } from 'lucide-react';

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-4xl font-semibold">Ask Your PDFs Anything.</h1>
            <UserButton afterSwitchSessionUrl="/"/>
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            {isAuth ? "Drop your PDF below or choose from your recent chats." : "Get instant answers and insights from your documents using AI."}
          </p>

          {isAuth && <div className="flex mt-2">
            <Button>Go to Chats</Button>
          </div>}

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ):(
              <Link href="/sign-in">
                <Button>
                  Login to get started
                  <LogInIcon/>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
