import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback to your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState<PuterUser | null>(null);

  // useEffect(() => {
  //   if (!auth.isAuthenticated) navigate("/auth?next=/");
  // }, [auth.isAuthenticated]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await auth.getUser();
        if (!user) {
          navigate("/auth?next=/");
          return;
        }
        setAuthUser(user);
      } catch (err) {
        console.log("Auth error:", err);
        navigate("/auth?next=/");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResume = resumes.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
    };

    loadResumes();
  });

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>
              No resumes found. Upload your first resume to get feedback.{" "}
            </h2>
          ) : (
            <h2>Review your submissions and check Ai-powered feedback.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col justify-center items-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
