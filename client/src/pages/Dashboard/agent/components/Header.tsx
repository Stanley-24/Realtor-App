import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const welcomeMessages = [
  "Welcome back, Trusted Agent! We love you and want to see you close more sales in our app.",
  "Great to see you! Keep pushing — every call brings you closer to your next closing.",
  "You're crushing it! Turn today's leads into tomorrow's commissions.",
  "Welcome back! Your next big sale is just one conversation away.",
  "Trusted Agent, you're on fire! Let's make today another win for your clients.",
  "Hello, superstar! Consistency is your superpower — keep showing up and closing deals.",
  "Welcome! Remember: Success in real estate is built one relationship at a time.",
  "Back for more wins? We've got your back — go close those deals!",
];

type HeaderProps = React.HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-16 px-4 md:px-6 relative",
        className
      )}
      {...props}
    >
      {/* Left: Sidebar Trigger */}
      <div className="flex-shrink-0 flex items-center text-primary-blue font-nunito text-base">
        <SidebarTrigger />
      </div>

      {/* Center: Marquee Message - lg+ */}
      <div className="absolute inset-x-0 pointer-events-none hidden lg:block">
        <div className="flex justify-center h-full items-center ">
          <div className="overflow-hidden max-w-2xl w-[60%] masked-marquee bg-pinky">
            <div className="animate-marquee whitespace-nowrap py-2">
              {welcomeMessages.map((message, index) => (
                <span
                  key={index}
                  className="text-lg text-gray-100 mx-12 inline-block"
                >
                  {message}
                </span>
              ))}
              {welcomeMessages.map((message, index) => (
                <span
                  key={`dup-${index}`}
                  className="text-lg text-gray-200 mx-12 inline-block"
                >
                  {message}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>


            {/* Center: Marquee Message - Mobile/Small screens (below lg) */}
      <div className="absolute inset-x-0 pointer-events-none lg:hidden">
        <div className="flex justify-center h-full items-center">
          <div className="overflow-hidden w-[70%] max-w-md masked-marquee bg-pinky">
            <div className="animate-marquee whitespace-nowrap py-2">
              {/* Single set of messages + one lighter duplicate for seamless loop */}
              {welcomeMessages.map((message, index) => (
                <span
                  key={index}
                  className="text-base text-gray-100 mx-3 inline-block"
                >
                  {message}
                </span>
              ))}
              {welcomeMessages.map((message, index) => (
                <span
                  key={`dup-${index}`}
                  className="text-base text-gray-200 mx-4 inline-block"
                >
                  {message}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* Right: Social Icons */}
      <div className="flex-shrink-0 flex items-center z-10">
        <div className="hidden lg:flex items-center text-lighty">
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Instagram className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Twitter className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="lg:hidden text-gray-800">
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-gray-600">
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Instagram className="mr-2 h-4 w-4" /> Instagram
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Twitter className="mr-2 h-4 w-4" /> Twitter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
