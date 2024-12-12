import { redirect } from 'next/navigation'

export default function Home() {

  redirect("/challenges")
  return (
    null
    /*<ChallengesPage/>*/
    /*<CodeEditor></CodeEditor>*/
  );
}

