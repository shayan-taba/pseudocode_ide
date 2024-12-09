import Image from "next/image";
import CodeEditor from "./components/code_editor/code_editor";
import Link from 'next/link';
import ChallengesPage from "./challenges/page";
import AuthPage from "./components/home/auth";


export default function Home() {
  return (
    <AuthPage />
    /*<ChallengesPage/>*/
    /*<CodeEditor></CodeEditor>*/
  );
}

