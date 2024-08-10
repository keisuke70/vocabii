import React from "react";

interface WordDetailProps {
  exampleSentences: string[];
  detailedDescription: string;
  nounPlural?: string | null;
  verbConjugations?: string | null;
}

const WordDetail: React.FC<WordDetailProps> = ({
  exampleSentences,
  detailedDescription,
  nounPlural,
  verbConjugations,
}) => {
  const [
    presentParticiple,
    pastTense,
    pastParticiple,
    thirdPersonSingularPresent,
  ] = verbConjugations
    ? verbConjugations.split(", ")
    : [null, null, null, null];

  const hasBothConjugationsAndNounPlural = verbConjugations && nounPlural;

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-lg">
      {(nounPlural || verbConjugations) && (
        <div className="flex flex-col md:flex-row mb-4  md:space-y-0 md:space-x-6">
          {verbConjugations && (
            <div className="flex-1 mr-5">
              <h2 className="md:text-lg text-base font-bold">
                Verb Conjugations
              </h2>
              <ul className="list-disc list-inside md:pl-5 md:text-base text-xs">
                <li>
                  <span className="font-semibold text-xs sm:text-sm md:text-base">
                    Pres. Participle:
                  </span>{" "}
                  {presentParticiple}
                </li>
                <li>
                  <span className="font-semibold  text-xs sm:text-sm  md:text-base">
                    Past Tense:
                  </span>{" "}
                  {pastTense}
                </li>
                <li>
                  <span className="font-semibold text-xs sm:text-sm  md:text-base">
                    Past Participle:
                  </span>{" "}
                  {pastParticiple}
                </li>
                <li>
                  <span className="font-semibold text-xs sm:text-sm  md:text-base">
                    3rd Person Sing. Pres.:
                  </span>{" "}
                  {thirdPersonSingularPresent}
                </li>
              </ul>
            </div>
          )}
          {nounPlural && (
            <div
              className={`flex-1 ${
                hasBothConjugationsAndNounPlural ? "mt-4 md:mt-0" : ""
              }`}
            >
              <h2 className="md:text-lg text-base font-bold">
                Noun Plural Form
              </h2>
              <p className="md:text-base text-xs">{nounPlural}</p>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <h2 className="md:text-lg text-base font-bold">Detailed Description</h2>
        <p className="md:text-base text-xs">{detailedDescription}</p>
      </div>

      <div>
        <h2 className="md:text-lg text-base font-bold">Example Sentences</h2>
        <ul className="list-disc list-inside md:pl-5 md:text-base text-xs">
          {exampleSentences.map((sentence, index) => (
            <li key={index} className="mb-1">
              {sentence}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordDetail;
