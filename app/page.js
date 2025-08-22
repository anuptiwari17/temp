import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChatInputBox } from "./_components/ChatInputBox";
import { Amatic_SC } from 'next/font/google'

const amatic = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function Home() {
  return (
    <>
    <ChatInputBox/>
    </>
    
  );
}
