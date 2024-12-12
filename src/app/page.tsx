import Image from "next/image";
import CodeEditor from "./components/ide/ide";
import Link from 'next/link';
import ChallengesPage from "./challenges/page";
import { redirect } from 'next/navigation'

export default function Home() {

  redirect("/challenges")
  return (
    null
    /*<ChallengesPage/>*/
    /*<CodeEditor></CodeEditor>*/
  );
}

