import { usePuterStore } from "lib/puter";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const meta = () => [
  {
    title: "Resumind | Review",
    name: "description",
    content: "Detailed overview of resume",
  },
];

const resume = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imagePath = await fs.read(data.imagePath);
      if (!imagePath) return;
      const imageUrl = URL.createObjectURL(imagePath);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />{" "}
          <span className="text-gray-800 text-sm font-semibold">
            Back To Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')bg-cover h-[100vh] sticky top-0 items-center justify-center]">
          {imageUrl && resumeUrl && (
            <div className=" animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a>
                <img
                  src={imageUrl}
                  className="w-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
