import Image from "next/image";
import CodeEditor from "./components/ide/ide";
import Link from 'next/link';
import ChallengesPage from "./challenges/page";
import AuthPage from "./components/auth/auth";


export default function Home() {
  return (
    <AuthPage />
    /*<ChallengesPage/>*/
    /*<CodeEditor></CodeEditor>*/
  );
}

