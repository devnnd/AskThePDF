import { Button } from "@/components/ui/button";
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

          <div className="flex mt-2">
            {isAuth && <Button>Go to Chats</Button>}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">Get instant answers and insights from your documents using AI.</p>

          <div className="w-full mt-4">
            {isAuth ? (
              <h1>fileUpload</h1>
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
